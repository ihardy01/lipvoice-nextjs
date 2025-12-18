// lib/axios.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// Định nghĩa kiểu cho hàng đợi request bị lỗi
interface FailedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // QUAN TRỌNG: Cho phép gửi/nhận cookie (HttpOnly) từ backend
});

// Biến cờ để kiểm tra xem có đang refresh token không
let isRefreshing = false;
// Hàng đợi các request bị lỗi trong khi đang refresh token
let failedQueue: FailedRequest[] = [];

// Hàm xử lý hàng đợi sau khi refresh xong (thành công hoặc thất bại)
const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Interceptor cho Request: Gắn Guest ID và Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // --- Xử lý Guest ID ---
    // Kiểm tra xem đã đăng nhập chưa (Tuỳ thuộc vào cách bạn lưu state,
    // nhưng nếu token là HttpOnly cookie thì JS không đọc được để check.
    // Tốt nhất là luôn gửi GuestID, backend sẽ ưu tiên UserID nếu parse được Token).

    let guestId = Cookies.get("guest_id");

    // Nếu chưa có guest_id trong cookie, tạo mới
    if (!guestId) {
      guestId = uuidv4();
      Cookies.set("guest_id", guestId, { expires: 365 }); // Lưu cookie 1 năm
    }

    // Gắn vào header
    config.headers["x-guest-id"] = guestId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. Interceptor cho Response: Xử lý lỗi 419 và Auto Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi là 419 (Token hết hạn) và chưa từng retry request này
    if (error.response?.status === 419 && !originalRequest._retry) {
      // Nếu đang có một tiến trình refresh token chạy rồi, thì request này phải đợi
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token.
        // Vì token lưu trong cookie HttpOnly, ta chỉ cần gọi endpoint này,
        // backend sẽ tự đọc refresh_token từ cookie cũ và set access_token mới vào cookie.
        await axiosInstance.post("/auth/refresh-token");

        // Nếu refresh thành công, xử lý các request đang đợi trong hàng đợi
        processQueue(null);
        isRefreshing = false;

        // Gọi lại request ban đầu bị lỗi
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng lỗi (hết hạn hẳn hoặc không hợp lệ)
        processQueue(refreshError, null);
        isRefreshing = false;

        // Xử lý logout: Xóa guest id hoặc redirect về login
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

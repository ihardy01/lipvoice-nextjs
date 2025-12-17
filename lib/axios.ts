// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 1. Interceptor cho Request: Tự động gắn Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc cookie)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. Interceptor cho Response: Xử lý lỗi chung (Ví dụ: Hết hạn token - 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Xử lý khi token hết hạn (Ví dụ: logout hoặc gọi api refresh token)
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

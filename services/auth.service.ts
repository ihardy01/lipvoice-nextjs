// services/auth.service.ts
import axiosInstance from "@/lib/axios";
import { AuthResponse, LoginPayload, ProfileResponse } from "@/types/auth";

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", {
      email: data.email, // Mapping field email từ form sang username của API
      password: data.password,
    });
    return response.data;
  },
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosInstance.get("/profile/me");
    return response.data;
  },
  logout: async (): Promise<any> => {
    // Gọi API logout để xóa session phía server (nếu cần)
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
  changePassword: async (data: {
    old_password?: string;
    new_password: string;
  }): Promise<any> => {
    const response = await axiosInstance.post("/auth/change-password", data); //
    return response.data;
  },
};

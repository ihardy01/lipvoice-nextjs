// services/auth.service.ts
import axiosInstance from "@/lib/axios";
import { AuthResponse, LoginPayload } from "@/types/auth";

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", {
      email: data.email, // Mapping field email từ form sang username của API
      password: data.password,
    });
    return response.data;
  },
};

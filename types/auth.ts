// types/auth.ts

export interface User {
  id: string;
  username: string;
}

export interface LoginPayload {
  email: string; // Trong API bạn gọi là username nhưng form nhập là email
  password: string;
}

export interface AuthResponse {
  message: string;
  status: number;
}

export interface ProfileMetadata {
  name: string;
  email: string;
  is_password: boolean;
  token: number;
  role: "customer" | "guest" | string;
}

export interface ProfileResponse {
  message: string;
  status: number;
  metadata: ProfileMetadata;
}

export interface AuthError {
  status: string;
  code: number;
  message: string;
}

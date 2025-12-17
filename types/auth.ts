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
  metadata: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface AuthError {
  status: string;
  code: number;
  message: string;
}

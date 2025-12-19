// types/voice.ts
import { Voice } from "./index"; // Import interface Voice gốc từ index.ts

// Kiểu dữ liệu cho các tham số lọc/phân trang gửi lên API
export interface VoiceQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  gender?: string;
  language?: string;
  style?: string;
  region?: string;
}

// Kiểu dữ liệu cho Pagination trả về từ API
export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Kiểu dữ liệu phản hồi đầy đủ từ API /voices/system
export interface VoiceSystemResponse {
  message: string;
  status: number;
  metadata: {
    voices: Voice[];
    pagination: PaginationMetadata;
  };
}

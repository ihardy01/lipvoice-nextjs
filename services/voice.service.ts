// services/voice.service.ts
import axiosInstance from "@/lib/axios";
import { VoiceQueryParams, VoiceSystemResponse } from "@/types/voice";

export const voiceApi = {
  // Lấy danh sách giọng đọc hệ thống (có phân trang & lọc)
  getSystemVoices: async (
    params: VoiceQueryParams,
  ): Promise<VoiceSystemResponse> => {
    // axios sẽ tự động serialize object params thành query string (vd: ?page=1&name=abc)
    const response = await axiosInstance.get("/voices/system", { params });
    return response.data;
  },

  // (Tuỳ chọn) Ví dụ thêm hàm lấy chi tiết 1 giọng nếu cần sau này
  getVoiceById: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/voices/${id}`);
    return response.data;
  },
};

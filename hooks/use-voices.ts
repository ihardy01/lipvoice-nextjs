// hooks/use-voices.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { voiceApi } from "@/services/voice.service";
import { VoiceQueryParams } from "@/types/voice";

export const useSystemVoices = (params: VoiceQueryParams) => {
  return useQuery({
    // queryKey bao gồm cả params.
    // Khi params thay đổi (vd: đổi trang, gõ tìm kiếm), query sẽ tự động chạy lại.
    queryKey: ["voices", "system", params],

    queryFn: () => voiceApi.getSystemVoices(params),

    // Giữ lại dữ liệu cũ trong khi đang fetch dữ liệu mới (giúp UX mượt mà khi phân trang)
    placeholderData: keepPreviousData,

    // Cache dữ liệu trong 1 phút để tránh gọi API quá nhiều nếu user switch tab qua lại
    staleTime: 60 * 1000,
  });
};

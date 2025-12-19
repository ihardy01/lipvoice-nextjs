// components/voice/voice-item.tsx
"use client";

import Image from "next/image";
import { Play, Pause, Heart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Voice } from "@/types";
import { useWaveSurfer } from "@/hooks/use-wave-surfer";

interface VoiceItemProps {
  data: Voice;
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceItem({ data, isSelected, onSelect }: VoiceItemProps) {
  // SỬA ĐỔI: Lấy đúng tên hàm togglePlayPause từ hook cũ
  const { containerRef, isPlaying, isReady, togglePlayPause } = useWaveSurfer(
    data.url,
  );

  const flagSrc = `/${data.language}.webp`;

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-3 rounded-xl border bg-white transition-all hover:shadow-md cursor-pointer",
        isSelected
          ? "border-[#FF3BD4] bg-[#FF3BD4]/5 ring-1 ring-[#FF3BD4]"
          : "border-border",
      )}
      // Sự kiện click vào khung bao ngoài sẽ kích hoạt chọn
      onClick={onSelect}
    >
      {/* Nút Play/Pause */}
      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 shrink-0"
        onClick={(e) => {
          e.stopPropagation(); // QUAN TRỌNG: Ngăn sự kiện nổi lên cha (không kích hoạt onSelect)
          togglePlayPause(); // Gọi đúng tên hàm từ hook
        }}
      >
        {isPlaying ? (
          <Pause className="fill-current h-4 w-4" />
        ) : (
          <Play className="fill-current h-4 w-4 ml-0.5" />
        )}
      </Button>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm shrink-0">
            <Image
              src={flagSrc}
              alt={data.language}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-semibold truncate text-foreground">
            {data.name}
          </span>
          {data.region && (
            <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 bg-muted rounded-sm">
              {data.region}
            </span>
          )}
        </div>

        {/* Vùng Waveform */}
        <div
          className="relative w-full h-10"
          // Ngăn click vào sóng nhạc kích hoạt onSelect (để người dùng có thể tua)
          onClick={(e) => e.stopPropagation()}
        >
          {!isReady && (
            <div className="absolute inset-0 flex items-center text-xs text-muted-foreground pointer-events-none">
              <Loader2 className="h-3 w-3 animate-spin mr-2" /> Loading audio...
            </div>
          )}
          <div ref={containerRef} className="w-full" />
        </div>
      </div>

      {/* Vùng Icon trạng thái & Yêu thích */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div
          className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center transition-all",
            isSelected ? "bg-[#FF3BD4] text-white" : "text-transparent",
          )}
        >
          <Check className="h-4 w-4" />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn click tim kích hoạt onSelect
            // Xử lý logic yêu thích tại đây
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

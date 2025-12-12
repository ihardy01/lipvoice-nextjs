"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Play,
  Pause,
  Heart,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Dữ liệu mẫu (2 dòng âm thanh như bạn đề cập)
const MOCK_VOICES = [
  {
    id: "19610196e6c0000000000000410",
    name: "Trần Huy - Tin tức",
    gender: "Nam",
    region: "MB",
    style: "Tin tức",
    language: "vi",
    flag: "/vi.webp",
    url: "https://minio.zoffice.vn/uploads/3cbd8bd5-0032-4452-be9f-ef53a55cc956.mp3",
  },
  {
    id: "19610196e6c0000000000000411",
    name: "Ngọc Huyền - Đọc truyện",
    gender: "Nữ",
    region: "MN",
    style: "Truyện",
    language: "vi",
    flag: "/vi.webp",
    url: "https://minio.zoffice.vn/uploads/3cbd8bd5-0032-4452-be9f-ef53a55cc956.mp3",
  },
];

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelected?: (voiceId: string) => void;
}

export function VoiceSelectionModal({
  open,
  onOpenChange,
  onVoiceSelected,
}: VoiceSelectionModalProps) {
  const [activeTab, setActiveTab] = useState("sample");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">Chọn giọng đọc mẫu</DialogTitle>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-[#F8F9FA]">
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full flex flex-col"
          >
            {/* Header Tabs mới: Full width */}
            <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent p-0 border-0 rounded-none pr-10">
              <TabsTrigger
                value="sample"
                className="h-full border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#DD00AC] data-[state=active]:text-[#DD00AC] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-semibold transition-all hover:text-[#DD00AC]/80"
              >
                Giọng đọc mẫu
              </TabsTrigger>
              <TabsTrigger
                value="clone"
                className="h-full border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#DD00AC] data-[state=active]:text-[#DD00AC] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-semibold transition-all hover:text-[#DD00AC]/80"
              >
                Nhân bản giọng
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: GIỌNG ĐỌC MẪU */}
            <TabsContent
              value="sample"
              className="flex-1 flex flex-col p-6 gap-4 overflow-hidden data-[state=inactive]:hidden mt-0"
            >
              {/* Search & Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Tìm kiếm bằng từ khoá liên quan"
                    className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  Bộ lọc
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Row */}
              {showFilters && (
                <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                  <SelectFilter
                    placeholder="Giới tính"
                    options={["Nam", "Nữ"]}
                  />
                  <SelectFilter
                    placeholder="Ngôn ngữ"
                    options={["Tiếng Việt", "Tiếng Anh"]}
                  />
                  <SelectFilter
                    placeholder="Phong cách"
                    options={["Tin tức", "Kể chuyện", "Quảng cáo"]}
                  />
                  <SelectFilter
                    placeholder="Vùng miền"
                    options={["Miền Bắc", "Miền Trung", "Miền Nam"]}
                  />
                </div>
              )}

              {/* List Voices */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {MOCK_VOICES.map((voice) => (
                  <VoiceItem
                    key={voice.id}
                    data={voice}
                    isSelected={selectedVoiceId === voice.id}
                    onSelect={() => {
                      setSelectedVoiceId(voice.id);
                      if (onVoiceSelected) onVoiceSelected(voice.id);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: NHÂN BẢN GIỌNG */}
            <TabsContent
              value="clone"
              className="flex-1 p-6 data-[state=inactive]:hidden mt-0"
            >
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Image
                    src="/voice.svg"
                    alt="Clone"
                    width={0}
                    height={0}
                    className="w-12 h-12 opacity-50"
                  />
                </div>
                <p>Tính năng nhân bản giọng đang được phát triển</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ... SelectFilter và VoiceItem giữ nguyên như trước ...
function SelectFilter({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <select className="h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground">
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function VoiceItem({
  data,
  isSelected,
  onSelect,
}: {
  data: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ws: any = null;
    let isCancelled = false; // Biến cờ để kiểm soát việc hủy

    const initWaveSurfer = async () => {
      if (!containerRef.current) return;

      try {
        const WaveSurferModule = (await import("wavesurfer.js")).default;

        // Nếu component đã unmount hoặc effect chạy lại trong lúc đang import, thì dừng lại
        if (isCancelled) return;

        // [Quan trọng] Xóa nội dung cũ trong container trước khi tạo mới để tránh trùng lặp
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        ws = WaveSurferModule.create({
          container: containerRef.current,
          waveColor: "#D1D5DB", // Màu sóng nền (xám)
          progressColor: "#DB2777", // Màu sóng khi chạy (hồng)
          cursorColor: "transparent",
          barWidth: 2,
          barGap: 3,
          barRadius: 2, // Bo tròn đầu sóng cho đẹp hơn
          height: 40,
          url: data.url,
        });

        ws.on("ready", () => {
          if (!isCancelled) setIsReady(true);
        });

        ws.on("finish", () => {
          if (!isCancelled) setIsPlaying(false);
        });

        ws.on("play", () => {
          if (!isCancelled) setIsPlaying(true);
        });

        ws.on("pause", () => {
          if (!isCancelled) setIsPlaying(false);
        });

        wavesurfer.current = ws;
      } catch (error) {
        console.error("Wavesurfer error:", error);
      }
    };

    initWaveSurfer();

    // Cleanup function
    return () => {
      isCancelled = true; // Đánh dấu đã hủy
      if (ws) {
        ws.destroy(); // Hủy instance wavesurfer
      }
    };
  }, [data.url]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-3 rounded-xl border bg-white transition-all hover:shadow-md cursor-pointer",
        isSelected
          ? "border-[#FF3BD4] bg-[#FF3BD4]/5 ring-1 ring-[#FF3BD4]"
          : "border-border",
      )}
      onClick={onSelect}
    >
      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 shrink-0"
        onClick={togglePlay}
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
              src={data.flag}
              alt={data.language}
              width={0}
              height={0}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-sm font-semibold truncate text-foreground">
            {data.name}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 bg-muted rounded-sm">
            {data.region}
          </span>
        </div>

        <div
          className="relative w-full h-10"
          onClick={(e) => e.stopPropagation()}
        >
          {!isReady && (
            <div className="absolute inset-0 flex items-center text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin mr-2" /> Loading audio...
            </div>
          )}
          {/* Container sóng âm */}
          <div ref={containerRef} className="w-full" />
        </div>
      </div>

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
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

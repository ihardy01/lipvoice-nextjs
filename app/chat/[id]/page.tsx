// app/chat/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  PanelLeft,
  PanelRight,
  Send,
  MoreVertical,
  MessageSquare,
  Search,
  Download,
  Copy,
  Pause,
  Play, // Thêm icon Play
  CircleCheckBig,
  CircleAlert,
  Loader2, // Thêm Loader
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VoiceItem } from "@/components/voice/voice-item";
import { MOCK_VOICES } from "@/constants/voices";
import { cn } from "@/lib/utils";
import { Voice } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useWaveSurfer } from "@/hooks/use-wave-surfer"; // Import hook

// --- TYPES ---
interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "audio" | string;
}

interface Message {
  id: string;
  message_id: string;
  state: "success" | "fail" | "process";
  text: string;
  language: string;
  voice_id: string;
  created_at: string; // Format: "16:00:00 18/12/2025"
  attachments: Attachment[];
}

// --- MOCK DATA ---
const MOCK_MESSAGES: Message[] = [
  {
    id: "0ed228aa-375d-4780-b486-0a3274010129",
    message_id: "30ef48af-89ed-47ef-aeb5-9362a1ed4fd5",
    state: "success",
    text: "Kh%C3%B4ng%20th%E1%BB%83%20nh%E1%BA%ADn%20d%E1%BA%A1ng%20%C3%A2m%20thanh.",
    language: "vi",
    voice_id: "19610196e6c0000000000000353",
    created_at: "16:00:00 18/12/2025",
    attachments: [
      {
        id: "79b66dd0-5205-40b6-aa2a-3ed6d6740246",
        name: "aaac655a-20a4-4c3f-9968-9a8a4ca36ed1.wav",
        url: "https://minio.zoffice.vn/zipai/synthesized/vois_20250408_150139_5470/20251211_160424_jYpcNocgXW.wav", // Dùng link mp3 thật để test sóng
        type: "audio",
      },
    ],
  },
  {
    id: "process-demo-id",
    message_id: "process-msg-id",
    state: "process",
    text: "T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20x%E1%BB%AD%20l%C3%BD...",
    language: "vi",
    voice_id: "19610196e6c0000000000000353",
    created_at: "16:05:00 19/12/2025",
    attachments: [],
  },
  {
    id: "fail-demo-id",
    message_id: "fail-msg-id",
    state: "fail",
    text: "L%E1%BB%97i%20khi%20t%E1%BA%A1o%20file.",
    language: "vi",
    voice_id: "19610196e6c0000000000000353",
    created_at: "16:10:00 20/12/2025",
    attachments: [],
  },
];

const MOCK_HISTORY = [
  { id: 1, title: "Kịch bản video AI", date: "Hôm nay" },
  { id: 2, title: "Kịch bản video TikTok", date: "Hôm qua" },
];

// --- SUB-COMPONENTS ---

// 1. Message Item Component (Tách ra để dùng hook useWaveSurfer cho từng item)
const MessageItem = ({ msg }: { msg: Message }) => {
  const audioUrl = msg.attachments.length > 0 ? msg.attachments[0].url : "";
  const { containerRef, isPlaying, isReady, togglePlay } =
    useWaveSurfer(audioUrl);

  const renderStatus = () => {
    return (
      <div className="flex flex-col gap-2 overflow-x-auto no-scrollbar">
        {/* Luôn hiển thị dòng này như yêu cầu */}
        <div className="flex items-center gap-2 text-green-600">
          <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
          <span className="text-xs md:text-sm whitespace-nowrap">
            Đọc dữ liệu thành công
          </span>
        </div>

        {/* Trạng thái thứ 2 tùy theo state */}
        {msg.state === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="text-xs md:text-sm whitespace-nowrap">
              Tệp âm thanh của bạn đã sẵn sàng
            </span>
          </div>
        )}
        {msg.state === "fail" && (
          <div className="flex items-center gap-2 text-red-600">
            <CircleAlert className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="text-xs md:text-sm whitespace-nowrap">
              Tệp âm thanh của bạn đã thất bại
            </span>
          </div>
        )}
        {msg.state === "process" && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
              <Image
                src="/loader-one.gif"
                alt="Processing"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs md:text-sm whitespace-nowrap">
              Tệp âm thanh của bạn đang chuẩn bị
            </span>
          </div>
        )}
      </div>
    );
  };

  // Lấy ngày từ chuỗi "HH:mm:ss DD/MM/YYYY" -> "DD/MM/YYYY"
  const displayDate = msg.created_at.split(" ")[1] || msg.created_at;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 transition-all duration-300">
      <div className="flex flex-col gap-4">
        {renderStatus()}

        <div className="flex flex-col min-w-0">
          {/* Bot Info */}
          <div className="flex items-center gap-3">
            <Avatar className="shrink-0 w-8 h-8 md:w-10 md:h-10">
              <AvatarImage src="/avatart-bot-chat.png" />
              <AvatarFallback>LV</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm md:text-base">
                LipVoiceAI
              </span>
              <Badge className="bg-linear-to-r from-[#dd00ac] to-[#7130c3] text-white text-[10px] md:text-xs">
                Bot
              </Badge>
            </div>
          </div>

          {/* Text Content */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed pl-0 md:pl-[52px] mt-2">
            {decodeURIComponent(msg.text)}
          </p>

          {/* Audio Player - Chỉ hiện khi success */}
          {msg.state === "success" && (
            <div className="md:ml-[52px] mt-2">
              <div className="p-3 md:p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="w-10 h-10 md:w-12.5 md:h-12.5 rounded-full bg-linear-to-b from-[#7130c3] to-[#dd00ac] shrink-0 flex items-center justify-center transition-transform active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6" fill="white" />
                    ) : (
                      <Play
                        className="w-5 h-5 md:w-6 md:h-6 ml-1"
                        fill="white"
                      />
                    )}
                  </Button>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            msg.language === "vi" ? "/vi.webp" : "/globe.svg"
                          }
                          alt={msg.language}
                          width={20}
                          height={14}
                          className="w-5 md:w-6 rounded-[2px]"
                        />
                        <span className="text-xs md:text-sm font-medium text-gray-700 truncate max-w-[150px] sm:max-w-full">
                          {msg.attachments[0]?.name || "Audio File"}
                        </span>
                      </div>
                    </div>
                    {/* Container cho wavesurfer */}
                    <div className="relative w-full h-10 md:h-16">
                      {!isReady && (
                        <div className="absolute inset-0 flex items-center text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />{" "}
                          Loading...
                        </div>
                      )}
                      <div ref={containerRef} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 md:ml-[52px] mt-3">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-xl border-gray-200 hover:text-primary hover:border-primary"
                >
                  <Copy className="w-4 h-4" />
                </Button>

                {msg.state === "success" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 rounded-xl border-gray-200 hover:text-primary hover:border-primary"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
              {displayDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Sidebar Components (Giữ nguyên)
const SidebarLeftContent = ({ onToggle }: { onToggle?: () => void }) => (
  <div className="flex flex-col h-full bg-muted/10">
    <div className="p-4 border-b flex items-center justify-between h-14 shrink-0">
      <span className="font-semibold text-sm">Lịch sử trò chuyện</span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>
        {onToggle && (
          <Button
            onClick={onToggle}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {MOCK_HISTORY.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className="w-full justify-start gap-2 h-auto py-3 text-left font-normal"
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm">{item.title}</span>
            <span className="text-[10px] text-muted-foreground">
              {item.date}
            </span>
          </div>
        </Button>
      ))}
    </div>
  </div>
);

const SidebarRightContent = ({
  selectedVoiceId,
  onVoiceSelect,
  onToggle,
}: {
  selectedVoiceId: string;
  onVoiceSelect: (id: string) => void;
  onToggle?: () => void;
}) => (
  <div className="flex flex-col h-full bg-background">
    <div className="p-4 border-b h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {onToggle && (
          <Button
            onClick={onToggle}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        )}
        <span className="font-semibold text-sm">Danh sách giọng</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {MOCK_VOICES.map((voice) => (
        <VoiceItem
          key={voice.id}
          data={voice}
          isSelected={selectedVoiceId === voice.id}
          onSelect={() => onVoiceSelect(voice.id)}
        />
      ))}
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isLeftSheetOpen, setIsLeftSheetOpen] = useState(false);
  const [isRightSheetOpen, setIsRightSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<Voice>(MOCK_VOICES[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const handleVoiceSelect = (voiceId: string) => {
    const voice = MOCK_VOICES.find((v) => v.id === voiceId);
    if (voice) {
      setSelectedVoice(voice);
      if (isMobile) setIsRightSheetOpen(false);
    }
  };

  const toggleLeftPanel = () => {
    if (isMobile) setIsLeftSheetOpen(true);
    else setShowLeftSidebar(!showLeftSidebar);
  };

  const toggleRightPanel = () => {
    if (isMobile) setIsRightSheetOpen(true);
    else setShowRightSidebar(!showRightSidebar);
  };

  const getGenderLabel = (voice: Voice) =>
    voice.gender === "female" ? "Nữ" : "Nam";
  const getRegionLabel = (voice: Voice) =>
    voice.region === "bac"
      ? "Miền Bắc"
      : voice.region === "nam"
        ? "Miền Nam"
        : "Miền Bắc";
  const getLanguageLabel = (voice: Voice) =>
    voice.language === "vi" ? "Tiếng Việt" : "English";

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Sheets Mobile */}
      <Sheet open={isLeftSheetOpen} onOpenChange={setIsLeftSheetOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Lịch sử chat</SheetTitle>
          </SheetHeader>
          <SidebarLeftContent />
        </SheetContent>
      </Sheet>

      <Sheet open={isRightSheetOpen} onOpenChange={setIsRightSheetOpen}>
        <SheetContent side="right" className="p-0 w-[320px] sm:w-[350px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Danh sách giọng</SheetTitle>
          </SheetHeader>
          <SidebarRightContent
            selectedVoiceId={selectedVoice.id}
            onVoiceSelect={handleVoiceSelect}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Left Sidebar */}
      <aside
        className={cn(
          "hidden md:flex border-r transition-all duration-300 flex-col",
          showLeftSidebar
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full opacity-0 overflow-hidden",
        )}
      >
        <SidebarLeftContent onToggle={toggleLeftPanel} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {(!showLeftSidebar || isMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLeftPanel}
            className="absolute top-3 left-3 z-30 text-muted-foreground hover:text-primary bg-white/50 hover:bg-white/90 backdrop-blur-sm shadow-sm border"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}

        {(!showRightSidebar || isMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            className="absolute top-3 right-3 z-30 text-muted-foreground hover:text-primary bg-white/50 hover:bg-white/90 backdrop-blur-sm shadow-sm border"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-0">
          <div className="w-full max-w-3xl mx-auto space-y-6">
            {MOCK_MESSAGES.map((msg) => (
              <MessageItem key={msg.id} msg={msg} />
            ))}
            <div className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t shrink-0 z-20">
          <div className="w-full max-w-3xl mx-auto space-y-3">
            <div className="relative rounded-2xl border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) =>
                  setInputText(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder="Nhập nội dung cần chuyển đổi..."
                className="w-full min-h-[52px] max-h-[200px] py-3.5 pl-4 pr-14 rounded-2xl bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground overflow-y-auto"
                rows={1}
              />
              <div className="absolute right-2 bottom-2">
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-[70%]">
                <div className="flex items-center gap-1 shrink-0">
                  <span className="shrink-0">Giọng:</span>
                  <span className="font-semibold text-primary truncate max-w-[100px]">
                    {selectedVoice.name}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-[#65676b] whitespace-nowrap">
                  <div className="w-px h-3 bg-border" />
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={
                        selectedVoice.language === "vi"
                          ? "/vi.webp"
                          : "/globe.svg"
                      }
                      alt="Flag"
                      width={14}
                      height={10}
                      className="rounded-[1px]"
                    />
                    {getLanguageLabel(selectedVoice)}
                  </div>
                  <div className="w-px h-3 bg-border" />
                  <span>{getRegionLabel(selectedVoice)}</span>
                </div>
              </div>
              <span className="shrink-0">
                {inputText.length}/{MAX_CHARS} ký tự
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Right Sidebar */}
      <aside
        className={cn(
          "hidden md:flex border-l bg-background transition-all duration-300 flex-col",
          showRightSidebar
            ? "w-80 translate-x-0"
            : "w-0 translate-x-full opacity-0 overflow-hidden",
        )}
      >
        <SidebarRightContent
          selectedVoiceId={selectedVoice.id}
          onVoiceSelect={handleVoiceSelect}
          onToggle={toggleRightPanel}
        />
      </aside>
    </div>
  );
}

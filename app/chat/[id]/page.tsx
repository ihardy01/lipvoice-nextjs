// app/chat/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PanelLeft,
  PanelRight,
  Settings,
  Send,
  MoreVertical,
  MessageSquare,
  Search,
  Download,
  Copy,
  Pause,
  Play,
  CircleCheckBig,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { VoiceItem } from "@/components/voice/voice-item";
import { MOCK_VOICES } from "@/constants/voices";
import { cn } from "@/lib/utils";
import { Voice } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const MOCK_HISTORY = [
  { id: 1, title: "Kịch bản video AI", date: "Hôm nay" },
  { id: 2, title: "Kịch bản video TikTok", date: "Hôm qua" },
  { id: 3, title: "Thuyết trình AI", date: "3 ngày trước" },
  { id: 4, title: "Báo cáo tài chính", date: "1 tuần trước" },
];

// --- SUB-COMPONENTS ---

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
  const MAX_CHARS = 1000;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {/* --- MOBILE SHEETS --- */}
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

      {/* --- DESKTOP LEFT SIDEBAR --- */}
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

      {/* --- CENTER: MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Nút mở Sidebar Trái (Floating) */}
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

        {/* Nút mở Sidebar Phải (Floating) */}
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

        {/* --- NỘI DUNG CHAT --- */}
        <div className="max-w-3xl mx-auto space-y-3 pb-40 md:pb-4 pt-12 md:pt-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 transition-all duration-300">
            <div className="flex flex-col gap-4">
              {/* Status Badges */}
              <div className="flex flex-col gap-3 overflow-x-auto">
                <div className="flex items-center gap-2 *:mx-2">
                  <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6 text-green-600 shrink-0" />
                  <span className="text-xs md:text-sm text-gray-600">
                    Đọc dữ liệu thành công
                  </span>
                </div>
                <div className="flex items-center gap-2 *:mx-2">
                  <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6 text-green-600 shrink-0" />
                  <span className="text-xs md:text-sm text-gray-600">
                    Tệp âm thanh của bạn đã sẵn sàng
                  </span>
                </div>
              </div>

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

                {/* Content Text */}
                <p className="text-gray-700 text-sm md:text-base leading-relaxed pl-0 md:pl-[52px] ">
                  Hello
                </p>

                {/* Audio Player */}
                <div className="md:ml-[52px] mt-2">
                  <div className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        className="w-10 h-10 md:w-12.5 md:h-12.5 rounded-full bg-linear-to-b from-[#7130c3] to-[#dd00ac] shrink-0 flex items-center justify-center transition-transform active:scale-95"
                      >
                        <Pause className="w-5 h-5 md:w-6 md:h-6" fill="white" />
                      </Button>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {/* Cờ hiển thị theo ngôn ngữ của tin nhắn */}
                            <Image
                              src="/vi.webp"
                              alt="VI"
                              width={20}
                              height={14}
                              className="w-5 md:w-6"
                            />
                            <span className="text-xs md:text-sm font-medium text-gray-700 truncate max-w-[150px] sm:max-w-full">
                              File
                            </span>
                          </div>
                        </div>
                        <div
                          id={`waveform-aassss`}
                          className="w-full h-10 md:h-16"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 md:ml-[52px] mt-2">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-xl border-gray-200"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-xl border-gray-200"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>

                  <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                    18/12/2001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="p-4 bg-background border-t mt-auto shrink-0 z-20">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) =>
                  setInputText(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder="Nhập nội dung cần chuyển đổi..."
                className="w-full min-h-20 p-3 pr-12 rounded-xl border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none bg-background text-sm"
              />
              <Button
                size="icon"
                className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-1 max-w-[70%]">
                <span className="shrink-0">Giọng đang chọn:</span>
                <span className="font-semibold text-primary truncate">
                  {selectedVoice.name}
                </span>
              </div>
              <span className="shrink-0">
                {inputText.length}/{MAX_CHARS} ký tự
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1 px-1 border-t border-dashed border-muted-foreground/20 overflow-x-auto no-scrollbar">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 text-xs font-medium text-[#65676b] whitespace-nowrap">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
                  <Image
                    src="/vi.webp"
                    alt="Flag"
                    width={16}
                    height={12}
                    className="rounded-[2px]"
                  />
                  {getLanguageLabel(selectedVoice)}
                </div>
                <div className="w-px h-3 bg-border" />
                <span className="hover:text-primary cursor-default">
                  Giọng {getGenderLabel(selectedVoice)}
                </span>
                <div className="w-px h-3 bg-border" />
                <span className="hover:text-primary cursor-default">
                  {getRegionLabel(selectedVoice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- DESKTOP RIGHT SIDEBAR --- */}
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

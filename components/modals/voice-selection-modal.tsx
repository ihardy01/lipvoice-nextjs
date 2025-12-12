"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Import dữ liệu và các component con đã được tách nhỏ
import { MOCK_VOICES } from "@/constants/voices";
import { VoiceFilters } from "@/components/voice/voice-filter";
import { VoiceList } from "@/components/voice/voice-list";

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelected?: (voiceId: string) => void;
  currentVoiceId?: string;
}

export function VoiceSelectionModal({
  open,
  onOpenChange,
  onVoiceSelected,
  currentVoiceId,
}: VoiceSelectionModalProps) {
  const [activeTab, setActiveTab] = useState("sample");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic lọc dữ liệu theo từ khóa tìm kiếm
  const filteredVoices = MOCK_VOICES.filter((voice) =>
    voice.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            {/* --- HEADER TABS --- */}
            <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent p-0 border-0 rounded-none pr-10">
              <VoiceTabTrigger value="sample" label="Giọng đọc mẫu" />
              <VoiceTabTrigger value="clone" label="Nhân bản giọng" />
            </TabsList>

            {/* --- TAB CONTENT: GIỌNG MẪU --- */}
            <TabsContent
              value="sample"
              className="flex-1 flex flex-col p-6 gap-4 overflow-hidden data-[state=inactive]:hidden mt-0"
            >
              {/* Search Bar & Filter Toggle */}
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

              {/* Filters Component - Hiển thị khi bấm nút Bộ lọc */}
              {showFilters && <VoiceFilters />}

              {/* Voice List Component - Hiển thị danh sách giọng đọc */}
              <VoiceList
                items={filteredVoices}
                currentVoiceId={currentVoiceId}
                onSelect={(id) => {
                  if (onVoiceSelected) onVoiceSelected(id);
                }}
              />
            </TabsContent>

            {/* --- TAB CONTENT: CLONE --- */}
            <TabsContent
              value="clone"
              className="flex-1 p-6 data-[state=inactive]:hidden mt-0"
            >
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <Image
                    src="/voice.svg"
                    alt="Clone"
                    width={48}
                    height={48}
                    className="opacity-50"
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

// Component con nội bộ để render Tab Trigger cho gọn code chính
function VoiceTabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="h-full border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#DD00AC] data-[state=active]:text-[#DD00AC] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-semibold transition-all hover:text-[#DD00AC]/80"
    >
      {label}
    </TabsTrigger>
  );
}

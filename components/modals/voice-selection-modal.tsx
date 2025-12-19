"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { VoiceFilters } from "@/components/voice/voice-filter";
import { VoiceList } from "@/components/voice/voice-list";
import { useSystemVoices } from "@/hooks/use-voices"; // Sử dụng Hook mới
import { Voice } from "@/types";

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelected?: (voice: Voice) => void; // Trả về full object Voice
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

  // State cho tìm kiếm & Debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State filters
  const [filters, setFilters] = useState({
    gender: "",
    language: "",
    style: "",
    region: "",
  });

  // State phân trang
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- 1. Xử lý Debounce cho Search (Delay 500ms trước khi gọi API) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- 2. Gọi Hook React Query ---
  const { data, isLoading } = useSystemVoices({
    page: page,
    limit: ITEMS_PER_PAGE,
    name: debouncedSearch,
    gender: filters.gender,
    language: filters.language,
    style: filters.style,
    region: filters.region,
  }); // Hook tự động chạy lại khi các params thay đổi

  const voices = data?.metadata?.voices || [];
  const pagination = data?.metadata?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // --- 3. Các hàm xử lý sự kiện ---
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggleFilters = () => {
    if (showFilters) {
      // Nếu đang mở mà tắt -> Reset filters
      setFilters({ gender: "", language: "", style: "", region: "" });
    }
    setShowFilters(!showFilters);
  };

  const handleVoiceSelect = (voiceId: string) => {
    const selectedVoice = voices.find((v) => v.id === voiceId);
    if (selectedVoice && onVoiceSelected) {
      onVoiceSelected(selectedVoice);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">Chọn giọng đọc</DialogTitle>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-[#F8F9FA]">
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full h-full flex flex-col"
          >
            {/* HEADER */}
            <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent p-0 border-0 rounded-none pr-10">
              <VoiceTabTrigger value="sample" label="Giọng đọc mẫu" />
              <VoiceTabTrigger value="favorite" label="Giọng yêu thích" />
            </TabsList>

            {/* SEARCH & FILTERS */}
            <div className="px-6 pt-6 flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Tìm kiếm giọng đọc..."
                    className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  onClick={toggleFilters}
                  className="gap-2"
                >
                  Bộ lọc
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {showFilters && (
                <VoiceFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* CONTENT LIST */}
            <div className="flex-1 flex flex-col p-6 pt-2 gap-4 overflow-hidden">
              <TabsContent
                value="sample"
                className="flex-1 flex flex-col gap-4 overflow-hidden mt-0"
              >
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <VoiceList
                    items={voices}
                    currentVoiceId={currentVoiceId}
                    onSelect={handleVoiceSelect}
                  />
                )}
              </TabsContent>

              <TabsContent
                value="favorite"
                className="flex-1 flex flex-col gap-4 overflow-hidden mt-0"
              >
                {/* Phần Favorite giữ nguyên logic hiển thị empty tạm thời */}
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Image
                      src="/favorite.svg"
                      alt="Empty"
                      width={48}
                      height={48}
                      className="opacity-50"
                    />
                  </div>
                  <p>Chưa có giọng đọc yêu thích nào.</p>
                </div>
              </TabsContent>

              {/* PAGINATION */}
              {totalPages > 1 && activeTab === "sample" && (
                <div className="pt-4 border-t bg-[#F8F9FA]">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={
                            page === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <div className="flex items-center justify-center px-4 text-sm font-medium">
                          Trang {page} / {totalPages}
                        </div>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={
                            page === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

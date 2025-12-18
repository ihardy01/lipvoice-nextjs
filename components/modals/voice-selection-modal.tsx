"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";

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

import { MOCK_VOICES } from "@/constants/voices";
import { VoiceFilters } from "@/components/voice/voice-filter";
import { VoiceList } from "@/components/voice/voice-list";

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelected?: (voiceId: string) => void;
  currentVoiceId?: string;
}

const ITEMS_PER_PAGE = 6;

export function VoiceSelectionModal({
  open,
  onOpenChange,
  onVoiceSelected,
  currentVoiceId,
}: VoiceSelectionModalProps) {
  const [activeTab, setActiveTab] = useState("sample");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc dữ liệu thô dựa trên tìm kiếm
  const filteredData = useMemo(() => {
    return MOCK_VOICES.filter((voice) =>
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Dữ liệu cho tab Giọng yêu thích (giả định có thuộc tính isFavorite)
  const favoriteVoicesData = useMemo(() => {
    return filteredData.filter((voice: any) => voice.isFavorite);
  }, [filteredData]);

  // Xác định danh sách hiển thị dựa trên tab đang hoạt động
  const currentTabData =
    activeTab === "sample" ? filteredData : favoriteVoicesData;

  // Tính toán phân trang
  const totalPages = Math.ceil(currentTabData.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentTabData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentTabData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset về trang 1 khi đổi tab
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
            {/* --- HEADER TABS --- */}
            <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent p-0 border-0 rounded-none pr-10">
              <VoiceTabTrigger value="sample" label="Giọng đọc mẫu" />
              <VoiceTabTrigger value="favorite" label="Giọng yêu thích" />
            </TabsList>

            {/* --- SEARCH & FILTERS --- */}
            <div className="px-6 pt-6 flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Tìm kiếm bằng từ khoá liên quan"
                    className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
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
              {showFilters && <VoiceFilters />}
            </div>

            {/* --- LIST CONTENT --- */}
            <div className="flex-1 flex flex-col p-6 pt-2 gap-4 overflow-hidden">
              <TabsContent
                value="sample"
                className="flex-1 flex flex-col gap-4 overflow-hidden mt-0"
              >
                <VoiceList
                  items={paginatedItems}
                  currentVoiceId={currentVoiceId}
                  onSelect={(id) => onVoiceSelected?.(id)}
                />
              </TabsContent>

              <TabsContent
                value="favorite"
                className="flex-1 flex flex-col gap-4 overflow-hidden mt-0"
              >
                {favoriteVoicesData.length > 0 ? (
                  <VoiceList
                    items={paginatedItems}
                    currentVoiceId={currentVoiceId}
                    onSelect={(id) => onVoiceSelected?.(id)}
                  />
                ) : (
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
                )}
              </TabsContent>

              {/* --- SHADCN UI PAGINATION --- */}
              {totalPages > 1 && (
                <div className="pt-4 border-t bg-[#F8F9FA]">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i + 1);
                            }}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
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

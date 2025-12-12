"use client";

import { useState } from "react";
import { Mic, Upload, FileAudio, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SpeechToTextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTextConverted?: (text: string) => void;
}

export function SpeechToTextModal({
  open,
  onOpenChange,
  onTextConverted,
}: SpeechToTextModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Giả lập hành động ghi âm
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Logic bắt đầu ghi âm thực tế sẽ ở đây
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      // Giả lập xử lý xong sau 1.5s
      setTimeout(() => {
        setIsProcessing(false);
        onOpenChange(false);
        if (onTextConverted)
          onTextConverted(
            "Đây là đoạn văn bản mẫu được chuyển từ giọng nói...",
          );
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Nhập liệu bằng giọng nói
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="record" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="record">Ghi âm</TabsTrigger>
            <TabsTrigger value="upload">Tải tệp lên</TabsTrigger>
          </TabsList>

          {/* TAB 1: GHI ÂM */}
          <TabsContent
            value="record"
            className="flex flex-col items-center gap-6 py-4"
          >
            <div className="relative">
              {isRecording && (
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
              )}
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className={cn(
                  "h-24 w-24 rounded-full border-4 shadow-xl transition-all duration-300",
                  isRecording
                    ? "border-red-100 bg-red-500 hover:bg-red-600 text-white scale-110"
                    : "border-primary/20 hover:border-primary hover:bg-primary/5 text-primary",
                )}
                onClick={toggleRecording}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-10 w-10 animate-spin" />
                ) : (
                  <Mic
                    className={cn("h-10 w-10", isRecording && "fill-current")}
                  />
                )}
              </Button>
            </div>

            <div className="text-center space-y-1">
              <p className="font-medium text-lg">
                {isProcessing
                  ? "Đang chuyển đổi..."
                  : isRecording
                    ? "Đang ghi âm..."
                    : "Nhấn để bắt đầu nói"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Nhấn lần nữa để kết thúc" : "Hỗ trợ tiếng Việt"}
              </p>
            </div>
          </TabsContent>

          {/* TAB 2: TẢI TỆP */}
          <TabsContent value="upload">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  Kéo thả hoặc nhấn để tải tệp âm thanh
                </p>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ MP3, WAV, M4A (Tối đa 10MB)
                </p>
              </div>
              <Button variant="secondary" size="sm" className="mt-2">
                Chọn tệp
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

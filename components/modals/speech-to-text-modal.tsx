"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Upload,
  Check,
  Globe,
  Square,
  Play,
  Pause,
  Trash2,
  FileAudio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useWaveSurfer } from "@/hooks/use-wave-surfer";

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
  const [activeTab, setActiveTab] = useState("record");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState("vi-VN");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sử dụng Hook useWaveSurfer từ dự án
  const { containerRef, isPlaying, togglePlay, currentTime, duration } =
    useWaveSurfer(audioUrl || "");

  // Xử lý ghi âm thật
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      alert("Không thể truy cập Micro. Vui lòng kiểm tra quyền trình duyệt.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Xử lý tải tệp
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setUploadedFile(null);
  };

  const handleConfirm = () => {
    onTextConverted?.("Văn bản đã được chuyển đổi từ tệp âm thanh của bạn...");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">Speech to Text</DialogTitle>
      <DialogContent className="sm:max-w-[700px] w-[95vw] h-[85vh] sm:h-[75vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-xl shadow-2xl">
        {/* Tab Header */}
        <div className="border-b bg-gray-50/50">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v);
              handleDelete();
            }}
            className="w-full"
          >
            <TabsList className="flex w-full h-14 bg-transparent p-0 justify-start px-4 gap-4 sm:gap-6">
              <STTTabTrigger value="record" label="Ghi âm" />
              <STTTabTrigger value="upload" label="Tải tệp" />
              <STTTabTrigger value="history" label="Lịch sử" />
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col p-5 sm:p-8 overflow-y-auto relative">
          {/* Ô Select Ngôn ngữ Full Width */}
          <div className="w-full mb-8 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#DD00AC]/20 focus:border-[#DD00AC] transition-all cursor-pointer appearance-none shadow-sm font-medium"
            >
              <option value="vi-VN">Tiếng Việt (Vietnam)</option>
              <option value="en-US">English (United States)</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {!audioUrl ? (
              activeTab === "record" ? (
                /* GIAO DIỆN GHI ÂM */
                <div className="flex flex-col items-center gap-6 animate-in fade-in">
                  <div className="relative">
                    {isRecording && (
                      <div className="absolute inset-[-20px] rounded-full bg-red-500/10 animate-ping" />
                    )}
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={cn(
                        "h-28 w-28 rounded-full border-[6px] shadow-xl transition-all duration-300",
                        isRecording
                          ? "bg-red-500 border-red-100 hover:bg-red-600 scale-105"
                          : "bg-white border-gray-50 text-[#DD00AC] hover:bg-gray-50",
                      )}
                    >
                      {isRecording ? (
                        <Square className="h-10 w-10 fill-white text-white" />
                      ) : (
                        <Mic className="h-12 w-12" />
                      )}
                    </Button>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isRecording
                        ? "text-red-500 animate-pulse"
                        : "text-gray-400",
                    )}
                  >
                    {isRecording
                      ? "Đang ghi âm... Nhấn để dừng"
                      : "Bấm vào Micro để bắt đầu ghi âm"}
                  </p>
                </div>
              ) : activeTab === "upload" ? (
                /* GIAO DIỆN TẢI TỆP */
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full min-h-[250px] border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30 hover:bg-gray-50 hover:border-[#DD00AC]/40 transition-all cursor-pointer group flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="p-6 bg-white rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-10 w-10 text-[#DD00AC]" />
                    </div>
                    <p className="text-base font-bold text-gray-700">
                      Nhấn để tải tệp âm thanh lên
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Hỗ trợ MP3, WAV, M4A (Tối đa 20MB)
                    </p>
                  </div>
                </div>
              ) : (
                /* LỊCH SỬ */
                <div className="text-gray-400 italic text-sm">
                  Chưa có lịch sử chuyển đổi
                </div>
              )
            ) : (
              /* TRÌNH PHÁT SÓNG ÂM KHI ĐÃ CÓ FILE */
              <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                {activeTab === "upload" && uploadedFile && (
                  <div className="flex items-center gap-2 text-[#DD00AC] font-medium bg-[#DD00AC]/5 px-4 py-2 rounded-full">
                    <FileAudio className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[250px]">
                      {uploadedFile.name}
                    </span>
                  </div>
                )}

                <div className="w-full max-w-lg bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => togglePlay(e as any)}
                      className="h-12 w-12 rounded-full bg-white shadow-sm text-[#DD00AC] hover:bg-white active:scale-90 transition-all shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="fill-current" />
                      ) : (
                        <Play className="fill-current ml-1" />
                      )}
                    </Button>

                    <div className="flex-1 flex flex-col gap-1">
                      {/* Container WaveSurfer từ hook */}
                      <div ref={containerRef} className="w-full h-[40px]" />

                      {/* Bộ đếm thời gian giây */}
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1 tracking-wider">
                        <span>{currentTime}</span>
                        <span>{duration}</span>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleDelete}
                      className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nút Xác nhận */}
          {audioUrl && (
            <div className="absolute bottom-6 right-6 animate-in slide-in-from-bottom-4">
              <Button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-[#DD00AC] to-[#7130c3] hover:opacity-90 shadow-xl px-10 py-6 rounded-2xl text-base font-bold gap-2"
              >
                <Check className="h-5 w-5" /> Xác nhận
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function STTTabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="h-full border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#DD00AC] data-[state=active]:text-[#DD00AC] data-[state=active]:bg-transparent text-sm sm:text-base font-bold transition-all px-2 sm:px-4"
    >
      {label}
    </TabsTrigger>
  );
}

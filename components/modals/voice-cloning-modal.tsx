"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Trash2, Play, Pause } from "lucide-react";
import { useWaveSurfer } from "@/hooks/use-wave-surfer";
import { VoiceList } from "@/components/voice/voice-list";
import { MOCK_VOICES } from "@/constants/voices";
import { toast } from "sonner";

export function VoiceCloningModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("clone");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sử dụng hook đã viết lại
  const {
    containerRef,
    isPlaying,
    togglePlayPause,
    setSpeed,
    formattedCurrentTime,
    formattedDuration,
  } = useWaveSurfer(audioUrl);

  useEffect(() => {
    setSpeed(playbackSpeed);
  }, [playbackSpeed, setSpeed, audioUrl]);

  // Lọc giọng đã lưu (giả định dùng isFavorite như bên VoiceSelectionModal)
  const savedVoices = MOCK_VOICES.filter((voice: any) => voice.isFavorite);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setRecordingTime(0);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 7) {
            stopRecording();
            return 8;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Không thể truy cập Micro");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAudioUrl(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">Nhân bản giọng nói</DialogTitle>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-[#F8F9FA]">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          {/* --- HEADER TABS: Đồng bộ màu sắc với VoiceSelectionModal --- */}
          <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent p-0 border-0 rounded-none pr-10">
            <VoiceTabTrigger value="clone" label="Nhân bản giọng" />
            <VoiceTabTrigger value="saved" label="Giọng đã lưu" />
          </TabsList>

          {/* --- NỘI DUNG TAB NHÂN BẢN --- */}
          <TabsContent
            value="clone"
            className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto mt-0"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#65676b]">
                Ngôn ngữ nguồn
              </label>
              <select className="w-full h-11 px-4 rounded-md border border-input bg-white text-sm outline-none focus:ring-2 focus:ring-[#DD00AC]/20">
                <option value="vi">Tiếng Việt</option>
                <option value="en">Tiếng Anh</option>
              </select>
            </div>

            <div className="flex-1 min-h-[300px] bg-white border-2 border-dashed border-[#DD00AC]/20 rounded-3xl flex flex-col items-center justify-center p-6 shadow-sm">
              {!audioUrl && !isRecording ? (
                <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*"
                  />
                  <ActionButton
                    icon={<Upload className="h-6 w-6 text-[#DD00AC]" />}
                    label="Tải tệp lên"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <ActionButton
                    icon={<Mic className="h-6 w-6 text-[#DD00AC]" />}
                    label="Ghi âm (8s)"
                    onClick={startRecording}
                  />
                </div>
              ) : isRecording ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#DD00AC]/10 rounded-full animate-ping" />
                    <div className="h-16 w-16 bg-[#DD00AC] rounded-full flex items-center justify-center text-white">
                      <Mic className="h-8 w-8" />
                    </div>
                  </div>
                  <span className="text-2xl font-mono font-bold text-[#DD00AC]">
                    00:0{recordingTime} / 00:08
                  </span>
                  <Button
                    variant="outline"
                    onClick={stopRecording}
                    className="border-[#DD00AC] text-[#DD00AC] hover:bg-[#DD00AC]/5 rounded-full px-8"
                  >
                    Dừng ghi
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-8">
                  <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100">
                    <div ref={containerRef} className="w-full" />
                    <div className="flex justify-between text-xs mt-2 font-mono text-muted-foreground">
                      <span>{formattedCurrentTime}</span>
                      <span>{formattedDuration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 items-center">
                    {/* Thanh kéo chỉnh tốc độ */}
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-[#65676b]">
                        <span>Tốc độ đọc</span>
                        <span className="text-[#DD00AC]">
                          {playbackSpeed.toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="1.2"
                        step="0.1"
                        value={playbackSpeed}
                        onChange={(e) =>
                          setPlaybackSpeed(parseFloat(e.target.value))
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#DD00AC]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={togglePlayPause}
                        size="icon"
                        className="h-14 w-14 rounded-full bg-[#DD00AC] hover:bg-[#DD00AC]/90 shadow-lg"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>
                      <Button
                        onClick={() => setAudioUrl(null)}
                        size="icon"
                        variant="outline"
                        className="h-14 w-14 rounded-full border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500"
                      >
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              disabled={!audioUrl}
              className="w-full h-12 bg-linear-to-r from-[#DD00AC] to-[#410093] hover:opacity-90 rounded-xl font-bold transition-all shadow-md"
            >
              Bắt đầu nhân bản
            </Button>
          </TabsContent>

          {/* --- NỘI DUNG TAB GIỌNG ĐÃ LƯU: Giống hệt Tab Giọng yêu thích --- */}
          <TabsContent
            value="saved"
            className="flex-1 flex flex-col p-6 pt-2 gap-4 overflow-hidden mt-0"
          >
            {savedVoices.length > 0 ? (
              <VoiceList
                items={savedVoices}
                onSelect={(id) => console.log(id)}
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
                <p>Chưa có giọng nhân bản nào được lưu.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper components để đồng bộ UI
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

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex flex-col h-32 gap-3 border-[#DD00AC]/10 hover:border-[#DD00AC] hover:bg-[#DD00AC]/5 rounded-2xl transition-all group bg-white shadow-sm"
    >
      <div className="p-3 bg-[#DD00AC]/5 rounded-full group-hover:bg-white transition-colors">
        {icon}
      </div>
      <span className="text-sm font-semibold text-[#65676b] group-hover:text-[#DD00AC]">
        {label}
      </span>
    </Button>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SpeechToTextModal } from "@/components/modals/speech-to-text-modal";
import {
  VoiceSelectionModal, // [!code ++] Import data
} from "@/components/modals/voice-selection-modal";
import { VoiceCloningModal } from "@/components/modals/voice-cloning-modal";
import { MOCK_VOICES } from "@/constants/voices";
import Image from "next/image";
import { Voice } from "@/types";
import { voiceApi } from "@/services/voice.service";

const STORAGE_KEY = "lipvoice_selected_voice";

export default function Home() {
  const [text, setText] = useState("");
  const [isSTTModalOpen, setIsSTTModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

  // [!code ++] State lưu giọng đã chọn (object đầy đủ)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  // [!code ++] Effect khởi tạo giọng nói từ localStorage
  useEffect(() => {
    const initVoice = async () => {
      try {
        // 1. Kiểm tra LocalStorage xem user đã chọn trước đó chưa
        const storedVoice = localStorage.getItem(STORAGE_KEY);

        if (storedVoice) {
          setSelectedVoice(JSON.parse(storedVoice));
        } else {
          // 2. Nếu chưa có, gọi API lấy 1 giọng đầu tiên làm mặc định
          // Sử dụng voiceApi trực tiếp thay vì hook để kiểm soát việc chỉ gọi 1 lần
          const data = await voiceApi.getSystemVoices({ limit: 1, page: 1 });

          if (data && data.metadata && data.metadata.voices.length > 0) {
            const defaultVoice = data.metadata.voices[0];
            setSelectedVoice(defaultVoice);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVoice));
          }
        }
      } catch (error) {
        console.error("Failed to initialize voice:", error);
      }
    };

    initVoice();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARS) {
      setText(inputValue);
    }
  };

  const handleSTTResult = (result: string) => {
    const newText = text + (text ? " " : "") + result;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  // [!code ++] Hàm xử lý khi chọn giọng từ Modal
  const handleVoiceSelected = (voice: Voice) => {
    setSelectedVoice(voice);
    // Lưu lựa chọn mới vào LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voice));
    // Modal tự đóng do logic trong modal, hoặc bạn có thể gọi setIsModalOpen(false) tại đây nếu muốn chắc chắn
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-10 pb-20 px-4 sm:px-6">
      {/* 1. LOGO */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/lipvoice.png"
          alt="LipVoice Logo"
          width={299}
          height={95}
        />
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-6 text-[#65676b]">
        {/* 2. KHU VỰC NHẬP TEXT */}
        <div className="relative z-10 rounded-4xl border-[#d63384] border-2 shadow-sm transition-all bg-white">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Nhập văn bản..."
            className="w-full p-4 rounded-4xl outline-none resize-none overflow-hidden flex items-center bg-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-between items-center px-6 pb-4">
          <span>
            {/* [!code change] Hiển thị tên giọng đã chọn */}
            Giọng nói đã chọn:{" "}
            <span className="font-semibold text-primary">
              {selectedVoice?.name || "Chọn giọng"}
            </span>
          </span>
          <span>
            {text.length}/{MAX_CHARS} ký tự
          </span>
        </div>

        {/* 3. BUTTONS CHỨC NĂNG */}
        <div className="grid grid-cols-3 gap-4 ">
          <ActionButton
            icon="/voice.svg"
            label="Speech to text"
            onClick={() => setIsSTTModalOpen(true)}
          />
          <ActionButton
            icon="/setting.svg"
            label="Chọn giọng đọc mẫu"
            onClick={() => setIsVoiceModalOpen(true)}
          />
          <ActionButton
            icon="/voice-cloning.svg"
            label="Nhân bản giọng"
            onClick={() => setIsCloneModalOpen(true)}
          />
        </div>

        {/* 4. BUTTON TẠO FILE */}
        <Button
          size="lg"
          className="w-50 mx-auto h-12.5 text-base rounded-md bg-linear-to-r from-[#DD00AC] to-[#410093] hover:from-[#FF00EE] hover:to-[#7130c3] transition-all active:scale-[0.98]"
        >
          Tạo tệp âm thanh
        </Button>
      </div>

      {/* COMPONENT MODALS */}
      <SpeechToTextModal
        open={isSTTModalOpen}
        onOpenChange={setIsSTTModalOpen}
        onTextConverted={handleSTTResult}
      />

      <VoiceSelectionModal
        open={isVoiceModalOpen}
        onOpenChange={setIsVoiceModalOpen}
        currentVoiceId={selectedVoice?.id} // Truyền ID để Modal highlight đúng giọng đang chọn
        onVoiceSelected={handleVoiceSelected}
      />
      <VoiceCloningModal
        open={isCloneModalOpen}
        onOpenChange={setIsCloneModalOpen}
      />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-4 flex flex-col items-center gap-2 border-0 shadow-none hover:bg-transparent hover:text-[#FF3BD4]"
    >
      <Image src={icon} alt={label} width={45} height={45} />
      <span className="text-xs sm:text-sm font-medium text-center">
        {label}
      </span>
    </Button>
  );
}

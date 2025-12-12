"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SpeechToTextModal } from "@/components/modals/speech-to-text-modal";
import Image from "next/image";

export default function Home() {
  const [text, setText] = useState("");
  const [isSTTModalOpen, setIsSTTModalOpen] = useState(false); // [!code ++] State cho Modal
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARS) {
      setText(inputValue);
    }
  };

  // [!code ++] Hàm nhận text từ Modal Speech-to-Text
  const handleSTTResult = (result: string) => {
    // Nối thêm text hoặc thay thế tuỳ logic của bạn
    const newText = text + (text ? " " : "") + result;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
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
        <div className="relative z-10 rounded-4xl border-[#d63384] border-2 shadow-sm transition-all ">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Nhập văn bản..."
            className="w-full p-6 rounded-4xl outline-none resize-none overflow-hidden flex items-center"
          />
        </div>
        <div className="flex justify-between items-center px-6 pb-4">
          <span>
            Giọng nói đã chọn: <span>Mặc định</span>
          </span>
          <span>
            {text.length}/{MAX_CHARS} ký tự
          </span>
        </div>

        {/* 3. BUTTONS CHỨC NĂNG */}
        <div className="grid grid-cols-3 gap-4 ">
          {/* [!code ++] Thêm sự kiện onClick mở Modal */}
          <ActionButton
            icon="/voice.svg"
            label="Speech to Text"
            onClick={() => setIsSTTModalOpen(true)}
          />
          <ActionButton icon="/setting.svg" label="Chọn giọng mẫu" />
          <ActionButton icon="/favorite.svg" label="Giọng yêu thích" />
        </div>

        {/* 4. BUTTON TẠO FILE */}
        <Button
          size="lg"
          className="w-50 mx-auto h-12.5 text-base rounded-md bg-linear-to-r from-[#DD00AC] to-[#410093] hover:from-[#FF00EE] hover:to-[#7130c3] transition-all active:scale-[0.98]"
        >
          Tạo tệp âm thanh
        </Button>
      </div>

      {/* [!code ++] COMPONENT MODAL */}
      <SpeechToTextModal
        open={isSTTModalOpen}
        onOpenChange={setIsSTTModalOpen}
        onTextConverted={handleSTTResult}
      />
    </div>
  );
}

// [!code ++] Cập nhật ActionButton để nhận onClick
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

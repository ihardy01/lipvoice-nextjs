// components/voice/voice-list.tsx
"use client";

import { Voice } from "@/types";
import { VoiceItem } from "./voice-item";

interface VoiceListProps {
  items: Voice[];
  currentVoiceId?: string;
  onSelect: (id: string) => void;
}

export function VoiceList({ items, currentVoiceId, onSelect }: VoiceListProps) {
  // Xử lý trường hợp không có dữ liệu (Empty State)
  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground py-10">
        <p>Không tìm thấy giọng đọc phù hợp.</p>
      </div>
    );
  }

  // Render danh sách
  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
      {items.map((voice) => (
        <VoiceItem
          key={voice.id}
          data={voice}
          isSelected={currentVoiceId === voice.id}
          onSelect={() => onSelect(voice.id)}
        />
      ))}
    </div>
  );
}

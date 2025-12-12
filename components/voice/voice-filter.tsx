// components/voice/voice-filters.tsx
import { VOICE_FILTERS } from "@/constants/voices";

interface SelectFilterProps {
  placeholder: string;
  options: { id: string; name: string }[];
}

function SelectFilter({ placeholder, options }: SelectFilterProps) {
  return (
    <select className="h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground">
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
}

export function VoiceFilters() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
      <SelectFilter placeholder="Giới tính" options={VOICE_FILTERS.GENDERS} />
      <SelectFilter placeholder="Ngôn ngữ" options={VOICE_FILTERS.LANGUAGES} />
      <SelectFilter placeholder="Phong cách" options={VOICE_FILTERS.STYLES} />
      <SelectFilter placeholder="Vùng miền" options={VOICE_FILTERS.REGIONS} />
    </div>
  );
}

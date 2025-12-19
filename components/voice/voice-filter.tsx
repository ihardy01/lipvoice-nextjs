// components/voice/voice-filter.tsx
import { VOICE_FILTERS } from "@/constants/voices";

interface VoiceFiltersProps {
  filters: {
    gender: string;
    language: string;
    style: string;
    region: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

interface SelectFilterProps {
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

function SelectFilter({
  placeholder,
  options,
  value,
  onChange,
}: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
}

export function VoiceFilters({ filters, onFilterChange }: VoiceFiltersProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
      <SelectFilter
        placeholder="Giới tính"
        options={VOICE_FILTERS.GENDERS}
        value={filters.gender}
        onChange={(val) => onFilterChange("gender", val)}
      />
      <SelectFilter
        placeholder="Ngôn ngữ"
        options={VOICE_FILTERS.LANGUAGES}
        value={filters.language}
        onChange={(val) => onFilterChange("language", val)}
      />
      <SelectFilter
        placeholder="Phong cách"
        options={VOICE_FILTERS.STYLES}
        value={filters.style}
        onChange={(val) => onFilterChange("style", val)}
      />
      <SelectFilter
        placeholder="Vùng miền"
        options={VOICE_FILTERS.REGIONS}
        value={filters.region}
        onChange={(val) => onFilterChange("region", val)}
      />
    </div>
  );
}

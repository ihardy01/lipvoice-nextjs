// constants/voices.ts
import { Voice } from "@/types";

export const MOCK_VOICES: Voice[] = [
  {
    id: "19610196e6c0000000000000410",
    name: "Trần Huy - Tin tức",
    language: "vi",
    url: "https://minio.zoffice.vn/uploads/3cbd8bd5-0032-4452-be9f-ef53a55cc956.mp3",
  },
  {
    id: "19610196e6c0000000000000411",
    name: "Ngọc Huyền - Đọc truyện",
    language: "vi",
    url: "https://minio.zoffice.vn/uploads/3cbd8bd5-0032-4452-be9f-ef53a55cc956.mp3",
  },
];

export const VOICE_FILTERS = {
  LANGUAGES: [
    { id: "vi", name: "Tiếng Việt" },
    { id: "en", name: "Tiếng Anh" },
  ],
  GENDERS: [
    { id: "male", name: "Nam" },
    { id: "female", name: "Nữ" },
  ],
  STYLES: [
    { id: "truyen", name: "Truyện" },
    { id: "mangxahoi", name: "Mạng xã hội" },
    { id: "tho", name: "Thơ" },
    { id: "podcast", name: "Postcast" },
  ],
  REGIONS: [
    { id: "bac", name: "Miền Bắc" },
    { id: "trung", name: "Miền Trung" },
    { id: "nam", name: "Miền Nam" },
  ],
};

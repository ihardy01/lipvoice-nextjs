// types/index.ts
export interface Voice {
  id: string;
  name: string;
  language: string;
  url: string;
  // Các trường optional để phục vụ việc filter sau này
  gender?: string;
  style?: string;
  region?: string;
}

export interface FilterOption {
  id: string;
  name: string;
}

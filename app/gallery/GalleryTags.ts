export interface GalleryTagsOption {
  readonly label: string;
  readonly color?: string;
  readonly value?: string;
  readonly options?: GalleryTagsOption[];
}

export const eventTags = [
  { value: "spring", label: "🌸春" },
  { value: "summer", label: "🌻夏" },
  { value: "autumn", label: "🍂秋" },
  { value: "winter", label: "⛄冬" },
  { value: "valentine", label: "🍫バレンタインデー" },
  { value: "easter", label: "🐰イースター" },
  { value: "halloween", label: "🎃ハロウィン" },
  { value: "christmas", label: "🎄クリスマス" },
  { value: "yosonoko", label: "🎨よその子" },
  { value: "birthday", label: "🎂誕生日" },
  { value: "myBirthday", label: "🎂自分の誕生日" },
] as GalleryTagsOption[];

export const monthTags = [
  { value: "january", label: "1月" },
  { value: "february", label: "2月" },
  { value: "march", label: "3月" },
  { value: "april", label: "4月" },
  { value: "may", label: "5月" },
  { value: "june", label: "6月" },
  { value: "july", label: "7月" },
  { value: "august", label: "8月" },
  { value: "september", label: "9月" },
  { value: "october", label: "10月" },
  { value: "november", label: "11月" },
  { value: "december", label: "12月" },
] as GalleryTagsOption[];

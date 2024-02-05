export interface GalleryTagsOption {
  name?: string;
  label: string;
  color?: string;
  value?: string;
  index?: number;
  options?: GalleryTagsOption[];
}

export const defaultTags: GalleryTagsOption[] = [
  {
    label: "シーズン", name: "season", options: [
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
    ]
  },
  {
    label: "マンスリー", name: "monthly", options: [
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
    ]
  }
]

export const defaultFilterTags: GalleryTagsOption[] = [
  {
    label: "固定編集用",
    options: [
      { value: "topImage", label: "📍トップ画像" },
      { value: "pickup", label: "📍ピックアップ" },
    ],
  },
]

export function getTagsOptions(tags: GalleryTagsOption[]) {
  return tags.reduce(
    (a, c) => a.concat(c.options || c),
    [] as GalleryTagsOption[]
  );
}

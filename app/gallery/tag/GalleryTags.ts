export interface GalleryTagsOption {
  name?: string;
  label: string;
  color?: string;
  value?: string;
  index?: number;
  group?: string;
  editable?: boolean;
  options?: GalleryTagsOption[];
}

export const defaultTags: GalleryTagsOption[] = [
  {
    label: "マンスリー", name: "monthly", options: [
      { value: "filter:monthlyOnly", label: "🔎マンスリータグ", editable: false },
      { value: "month:1", label: "🎍1月" },
      { value: "month:2", label: "👹2月" },
      { value: "month:3", label: "🎎3月" },
      { value: "month:4", label: "🌸4月" },
      { value: "month:5", label: "🎏5月" },
      { value: "month:6", label: "☔6月" },
      { value: "month:7", label: "🎋7月" },
      { value: "month:8", label: "🥒8月" },
      { value: "month:9", label: "🎑9月" },
      { value: "month:10", label: "🍇10月" },
      { value: "month:11", label: "🍲11月" },
      { value: "month:12", label: "🎅12月" },
    ]
  },
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
      { value: "myBirthday", label: "🎂自分の誕生日" },
    ]
  },
  {
    label: "コミュニティ", name: "community", options: [
      { value: "project", label: "🎪企画・イベント" },
      { value: "synopsis", label: "📰設定資料" },
      { value: "yosonoko", label: "🐕よその子" },
      { value: "birthday", label: "🎂誕生日" },
    ]
  },
  {
    label: "すがた", name: "form", options: [
      { value: "darkForm", label: "😈やみのすがた" },
      { value: "foodForm", label: "🍲たべもののすがた" },
    ]
  },
  {
    label: "活動", name: "activity", options: [
      { value: "competition", label: "🚩コンペ" },
      { value: "prize", label: "👑入賞" },
      { value: "commission", label: "📒コミッション" },
    ]
  },
]

export const defaultFilterTags: GalleryTagsOption[] = [
  {
    label: "固定編集用",
    options: [
      { value: "filter:topImage", label: "📍トップ画像" },
      { value: "filter:pickup", label: "📍ピックアップ" },
    ],
  },
]

export const defaultSortTags: GalleryTagsOption[] = [
  {
    label: "ソート",
    options: [
      { value: "sort:leastRecently", label: "🕒古い順" },
      { value: "sort:nameOrder", label: "⬇️名前（昇順）" },
      { value: "sort:leastNameOrder", label: "⬆️名前（降順）" },
    ],
  },
]

export function getTagsOptions(tags: GalleryTagsOption[]) {
  return tags.reduce(
    (a, c) => a.concat(c.options || c),
    [] as GalleryTagsOption[]
  );
}

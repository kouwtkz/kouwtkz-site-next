import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
export const publicParam = { list: <Array<MediaImageItemType>>[] };
const buildTime = new Date();

export function getFilterImageList(option: { sort?: "asc" | "desc", filter?: string, list?: Array<MediaImageItemType> } = {}) {
  const { sort = "desc" } = option;
  return filterImageList(option).sort((a, b) => {
    const at = a.time || 0, bt = b.time || 0;
    return (sort === "desc" ? (at > bt) : (at < bt)) ? -1 : 1
  });
}

export function filterImageList(option: { filter?: string, list?: Array<MediaImageItemType> } = {}): Array<MediaImageItemType> {
  const { list = publicParam.list, filter = '' } = option;
  if (filter) {
    // ページ検索と同じような記述でタグ指定できる処理
    const queryList = filter.split(/[\s,]+/).map(s => { return { str: s.replace(/^!/, ''), not: s.startsWith('!') } });
    return list.filter((item) =>
      queryList.every(({ str, not }) => not ? item.tags?.every((tag) => (str !== tag)) : item.tags?.some((tag) => str === tag))
    );
  } else {
    return list;
  }
}

export const filterMonthList = [
  { month: 1, tags: ["january", "winter"] },
  { month: 2, tags: ["february", "winter", "valentine"] },
  { month: 3, tags: ["march", "spring", "easter"] },
  { month: 4, tags: ["april", "spring", "easter"] },
  { month: 5, tags: ["may", "spring"] },
  { month: 6, tags: ["june", "rainy"] },
  { month: 7, tags: ["july", "summer"] },
  { month: 8, tags: ["august", "summer"] },
  { month: 9, tags: ["september", "autumn"] },
  { month: 10, tags: ["october", "halloween", "autumn"] },
  { month: 11, tags: ["november", "autumn"] },
  { month: 12, tags: ["december", "winter", "myBirthday"] },
]

export function addFilterAutoSeason(filter = '', delimiter = ','): string {
  const filters = [filter];
  const month = buildTime.getMonth() + 1;
  const monthObject = filterMonthList.find(item => item.month === month);
  if (monthObject) filters.push(monthObject.tags.join(delimiter));
  return filters.join(delimiter);
}

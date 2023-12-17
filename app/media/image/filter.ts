import { MediaImageItemType } from "./MediaImageType";
export const publicParam = { list: <Array<MediaImageItemType>>[] };
const buildTime = new Date();

export function getFilterImageList(option: { sort?: "asc" | "desc", filter?: string, list?: Array<MediaImageItemType> } = {}) {
  const { sort = "desc" } = option;
  return filterImageList(option).sort((a, b) => {
    const at = a.time || 0, bt = b.time || 0;
    return (sort === "desc" ? (at > bt) : (at < bt)) ? -1 : 1
  });
}

export function filterImageList(option: { filter?: string, list?: Array<any> } = {}): Array<MediaImageItemType> {
  const { list = publicParam.list, filter = '' } = option;
  if (filter) {
    // ページ検索と同じような記述でタグ指定できる処理
    const queryList = filter.split(/[\s,]+/).map(s => { return { str: s.replace(/^!/, ''), not: s.startsWith('!') } });
    // deno-lint-ignore no-explicit-any
    return list.filter(l_e => queryList.some(ql_e => { const so = l_e.tags.some((ae_e: any) => ae_e == ql_e.str); return ql_e.not ? !so : so }))
  } else {
    return list;
  }
}

export function addFilterAutoSeason(filter = '', delimiter = ','): string {
  const filters = [filter];
  const month = buildTime.getMonth() + 1;
  let addMonthFilter = '';
  switch (month) {
    case 1:
      addMonthFilter = 'january,winter'
      break;
    case 2:
      addMonthFilter = 'february,winter,valentine'
      break;
    case 3:
      addMonthFilter = 'march,spring,easter'
      break;
    case 4:
      addMonthFilter = 'april,spring,easter'
      break;
    case 5:
      addMonthFilter = 'may,spring'
      break;
    case 6:
      addMonthFilter = 'june'
      break;
    case 7:
      addMonthFilter = 'july,summer'
      break;
    case 8:
      addMonthFilter = 'august,summer'
      break;
    case 9:
      addMonthFilter = 'september,autumn'
      break;
    case 10:
      addMonthFilter = 'october,halloween,autumn'
      break;
    case 11:
      addMonthFilter = 'november,autumn'
      break;
    case 12:
      addMonthFilter = 'december,winter,birthday'
      break;
  }
  if (addMonthFilter !== '') filters.push(addMonthFilter);
  return filters.join(delimiter);
}

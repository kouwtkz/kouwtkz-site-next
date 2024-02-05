import { ReadonlyURLSearchParams } from "next/navigation";

type paramsType = { [k: string]: string; };

interface queryMakeUrlProps {
  search: ReadonlyURLSearchParams;
  process: (params: paramsType) => void | paramsType;
}
export function queryMakeUrl({ search, process }: queryMakeUrlProps) {
  let params = Object.fromEntries(search);
  const setParams = process(params);
  if (setParams) params = setParams;
  const query = new URLSearchParams(params).toString();
  return location.pathname + (query ? "?" + query : "");
}

interface queryPushProps extends queryMakeUrlProps {
  scroll?: boolean;
  push: (href: string, options?: any) => any
}

export function queryPush({ scroll, push, ...makeUrlArgs }: queryPushProps) {
  const url = queryMakeUrl(makeUrlArgs);
  const option: { scroll?: boolean } = {};
  if (scroll !== undefined) option.scroll = scroll;
  if (url !== location.href) push(url, option);
}

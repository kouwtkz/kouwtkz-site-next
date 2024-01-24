import { ReadonlyURLSearchParams } from "next/navigation";

type paramsType = { [k: string]: string; };

type queryPushProps = {
  search: ReadonlyURLSearchParams;
  scroll?: boolean;
  process: (params: paramsType) => void | paramsType;
  push: (href: string, options?: any) => any
}

export default function queryPush({ search, scroll, process, push }: queryPushProps) {
  let params = Object.fromEntries(search);
  const setParams = process(params);
  if (setParams) params = setParams;
  const query = new URLSearchParams(params).toString();
  const url = location.pathname + (query ? "?" + query : "");
  const option: { scroll?: boolean } = {};
  if (scroll !== undefined) option.scroll = scroll;
  if (url !== location.href) push(url, option);
}
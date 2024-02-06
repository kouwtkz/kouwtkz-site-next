"use client";

import MultiParser from "@/app/components/functions/MultiParser";
import { useMarkdownDataState } from "./MarkdownDataState";

export function MdClientNode({ name }: { name: string }) {
  const { data } = useMarkdownDataState();
  if (data && data[name]) {
    return <MultiParser>{data[name]}</MultiParser>;
  } else {
    return null;
  }
}

import MultiParser from "@/app/components/functions/MultiParser";
import { GetMarkdownData } from "@/app/context/md/MarkdownData.mjs";

export function MdServerNode({ name }: { name: string }) {
  const data = GetMarkdownData(name);
  if (data) return <MultiParser>{data}</MultiParser>;
  else return null;
}

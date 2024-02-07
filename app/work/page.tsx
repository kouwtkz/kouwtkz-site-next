import { Metadata } from "next";
import Link from "next/link";
import { MdServerNode } from "../context/md/MarkdownDataServer";
import { MdClientNode } from "../context/md/MarkdownDataClient";
const title = "WORK";
export const metadata: Metadata = { title };
export default function Work() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {title}
      </h2>
      <MdClientNode name="work/info.md" />
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { MdServerNode } from "../context/md/MarkdownDataServer";
const title = "ABOUT";
export const metadata: Metadata = { title };
export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {title}
      </h2>
      <MdServerNode name="about/me.md" />
      <h3 className="my-6">
        <Link className="underline" href="/about/teck">
          このサイトの技術スタック
        </Link>
      </h3>
    </div>
  );
}

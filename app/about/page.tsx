import { Metadata } from "next";
import Link from "next/link";
import { MdClientNode } from "../context/md/MarkdownDataClient";
const title = "ABOUT";
export const metadata: Metadata = { title };

function MdSection({ title, mdSrc }: { title: string; mdSrc: string }) {
  return (
    <div className="my-4 flex flex-col items-center">
      <h4 className="mb-2">{title}</h4>
      <div className="mx-2 [&_ul]:text-left flex max-w-2xl">
        <MdClientNode className="about" name={mdSrc} />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {title}
      </h2>
      <MdSection title="プロフィール" mdSrc="about/profile.md" />
      <MdSection title="各種リンク" mdSrc="about/link.md" />
      <MdSection title="更新履歴" mdSrc="about/history.md" />
      <h3 className="my-4">
        <Link className="underline" href="/about/teck">
          このサイトの技術スタック
        </Link>
      </h3>
    </div>
  );
}

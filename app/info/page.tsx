import { Metadata } from "next";
import Link from "next/link";
import { MdClientNode } from "../context/md/MarkdownDataClient";
const title = "Info";
const label = "Information";
export const metadata: Metadata = { title: title.toUpperCase() };

function MdSection({ title, mdSrc }: { title: string; mdSrc: string }) {
  return (
    <div className="my-4 flex flex-col items-center">
      <h4 className="mb-2">{title}</h4>
      <div className="mx-2 [&_ul]:text-left flex max-w-2xl">
        <MdClientNode className="info" name={mdSrc} />
      </div>
    </div>
  );
}

export default function Info() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {label}
      </h2>
      <MdSection title="プロフィール" mdSrc="info/profile.md" />
      <MdSection title="各種リンク" mdSrc="info/link.md" />
      <MdSection title="更新履歴" mdSrc="info/history.md" />
      <h3 className="my-4">
        <Link className="underline" href="/info/teck">
          このサイトの技術スタック
        </Link>
      </h3>
    </div>
  );
}

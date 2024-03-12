import { Metadata } from "next";
import Link from "next/link";
import { MdSection } from "./Section";
const title = "Info";
const label = "Information";
export const metadata: Metadata = { title: title.toUpperCase() };

export default function Info() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {label}
      </h2>
      <MdSection title="プロフィール" mdSrc="info/profile.md" />
      <MdSection title="各種リンク" mdSrc="info/link.md" />
      <h4 className="my-4">
        <Link className="roundLink" href="/info/schedule">
          スケジュール
        </Link>
      </h4>
      <h4 className="my-4">
        <Link className="roundLink" href="/info/teck">
          更新履歴や技術スタック
        </Link>
      </h4>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
const title = "ABOUT";
export const metadata: Metadata = { title };

export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        {title}
      </h2>
      <ul className="text-left max-w-sm mx-auto">
        <li>
          <h3 className="my-6 text-main-deep">さくしゃ</h3>
          <ul>
            <li>なまえ: わたかぜコウ</li>
            <li>すきなこと: おえかき</li>
          </ul>
        </li>
        <li>
          <h3 className="my-6">
            <Link href="/about/teck">このサイトの技術スタック</Link>
          </h3>
        </li>
      </ul>
    </div>
  );
}

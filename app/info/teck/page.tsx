import { Metadata } from "next";
import { MdSection } from "../Section";
import { GitDetails } from "@/app/context/git/gitState";
const title = "TECK - ABOUT";
export const metadata: Metadata = { title };

export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-12">
        History & Tech.Stack
      </h2>
      <MdSection title="更新履歴" mdSrc="info/history.md">
        <GitDetails />
      </MdSection>

      <ul className="text-left max-w-sm mx-auto">
        <li>
          <h2 className="my-6 text-main-deep">このサイトの技術スタック</h2>
          <ul className="[&>li]:my-1 text-lg">
            <li>
              <a
                href="https://github.com/kouwtkz/kouwtkz-site-next"
                target="_blank"
                className="external underline"
              >
                このサイトのGithub
              </a>
            </li>
            <li>フレームワーク: Next.js(SSG)</li>
            <li>ホスティング: Cloudflare pages</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

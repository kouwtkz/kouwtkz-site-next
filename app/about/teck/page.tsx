import { Metadata } from "next";
const title = "TECK - ABOUT";
export const metadata: Metadata = { title };

export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-12">
        Technology Stack
      </h2>
      <ul className="text-left max-w-sm mx-auto">
        <li>
          <h2 className="my-6 text-main-deep">このサイトの技術スタック</h2>
          <ul className="[&>li]:my-1 text-lg">
            <li>
              <a
                href="https://github.com/kouwtkz/kouwtkz-site-next"
                target="_blank"
                className="underline"
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

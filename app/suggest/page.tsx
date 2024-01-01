import { Metadata } from "next";
import Link from "next/link";
const title = "SUGGEST";

export const metadata: Metadata = {
  title,
  robots: { index: false },
};

export default function Suggest() {
  return (
    <div>
      <div className="pt-8 mb-4">
        <h1 className="font-LuloClean text-3xl sm:text-4xl text-center text-main mb-2">
          {title}
        </h1>
        <h4 className="text-xl text-main-soft">
          他のサイトと間違えてませんか…？
        </h4>
      </div>
      <div className="font-Mandali inline-flex flex-col">
        <a
          href="https://www.cottonwinds.com/"
          target="_blank"
          rel="noopener"
          title="cottonwinds.com"
          className="inline-block my-4"
        >
          <h2 className="text-4xl">cottonwinds.com</h2>
          <h4 className="text-xl">Empresa textil ubicada en Mataró.</h4>
          <div className="text-xl text-main-soft">
            (※Not related to my site, but a lead for a typo)
          </div>
        </a>
        <Link href="/" title="トップに戻る" className="inline-block my-2">
          <h2 className="text-4xl">kouwtkz.cottonwind.com</h2>
          <h4 className="text-xl">
            Portfolio site of artist Kou Watakaze. (This site)
          </h4>
          <div className="font-KosugiMaru text-xl text-main-soft">
            わたかぜコウのサイトはこちらです！
          </div>
        </Link>
      </div>
    </div>
  );
}

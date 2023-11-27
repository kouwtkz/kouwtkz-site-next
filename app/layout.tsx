import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/header";

import {
  KosugiMaruFont,
  MandaliFont,
  MochiyPopOneFont,
  ZenMaruFont,
  LuloCleanFont,
} from "@/app/fonts/list";

export const metadata: Metadata = {
  title: "こっとんうぃんど",
  description: "わたかぜコウのポートフォリオサイト！",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={[
          "font-KosugiMaru",
          KosugiMaruFont.variable,
          MochiyPopOneFont.variable,
          MandaliFont.variable,
          ZenMaruFont.variable,
          LuloCleanFont.variable,
        ].join(" ")}
      >
        <Header />
        <div className="pt-24 pb-8">
          <div className="mx-auto bg-white bg-opacity-50 max-w-[1160px] min-h-[70vh]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

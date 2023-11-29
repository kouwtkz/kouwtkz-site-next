import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/navigation/header";
import { site } from "@/siteData/site";

import {
  KosugiMaruFont,
  MochiyPopOneFont,
  // MandaliFont,
  // ZenMaruFont,
  LuloCleanFont,
} from "@/app/fonts/list";

export const metadata: Metadata = {
  title: site.title,
  description: site.short.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={[
          KosugiMaruFont.variable,
          MochiyPopOneFont.variable,
          // MandaliFont.variable,
          // ZenMaruFont.variable,
          LuloCleanFont.variable,
        ].join(" ")}
      >
        <Header site={site} />
        <div className="text-center pt-24 pb-8 font-KosugiMaru">
          <div className="mx-auto bg-white bg-opacity-50 max-w-[1160px] min-h-[70vh]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

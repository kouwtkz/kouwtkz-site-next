import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/navigation/header";
import Footer from "@/app/components/navigation/footer";
import { site } from "@/app/site/SiteData.mjs";
import { currentDate } from "@/app/components/functions/general";
import ImageViewer from "./gallery/ImageViewer";
import CharaData from "./character/CharaData";
import MediaImageState from "./media/image/MediaImageState";
import ToasterContext from "@/app/context/toastContext";

import {
  KosugiMaruFont,
  MochiyPopOneFont,
  MandaliFont,
  // ZenMaruFont,
  LuloCleanFont,
} from "@/app/fonts/list";
import ServerStateMake from "./components/System/ServerStateMake";
import ClientSetup from "./components/System/ClientSetup";
import EmbedSync from "./components/System/EmbedSync";

export const metadata: Metadata = {
  title: site.title,
  description: site.short.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const currentUser = await getCurrentUser();
  return (
    <html lang="ja">
      <body
        className={[
          KosugiMaruFont.variable,
          MochiyPopOneFont.variable,
          MandaliFont.variable,
          // ZenMaruFont.variable,
          LuloCleanFont.variable,
        ].join(" ")}
      >
        <ToasterContext />
        <ClientSetup />
        <EmbedSync />
        <ServerStateMake />
        <ImageViewer />
        <CharaData />
        <MediaImageState />
        <Header site={site} />
        <div className="text-center pt-24 pb-8 font-KosugiMaru">
          <div className="mx-auto bg-white bg-opacity-50 max-w-[1160px] min-h-[70vh]">
            {children}
            <Footer site={site} currentDate={currentDate} />
          </div>
        </div>
        <div id="audio_background"></div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/app/components/navigation/header";
import Footer from "@/app/components/navigation/footer";
import { site } from "@/app/site/SiteData.mjs";
import { currentDate } from "@/app/components/functions/general";
import ImageViewer from "./gallery/ImageViewer";
import CharaData from "./character/CharaData";
import MediaImageState from "@/app/context/MediaImageState";
import PostState from "./blog/PostState";
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
import { DataStateAddMtime } from "./components/dataState/DataStateFunctions";
import Breakcrumb from "./components/navigation/breadcrumb";

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
        <MediaImageState url={DataStateAddMtime({ url: "/data/images.json" })} />
        <PostState
          url={DataStateAddMtime({
            url: "/blog/posts.json",
            file: "_data/post.json",
          })}
        />
        <Header site={site} />
        <div className="pt-16 pb-8 text-center font-KosugiMaru">
          <div className="mx-auto max-w-[1160px] min-h-[70vh]">
            <Breakcrumb />
            <div className="bg-white bg-opacity-50">
              {children}
              <Footer site={site} currentDate={currentDate} />
            </div>
          </div>
        </div>
        <div id="audio_background"></div>
      </body>
    </html>
  );
}

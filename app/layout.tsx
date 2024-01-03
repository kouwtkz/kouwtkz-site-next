import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/app/components/navigation/header";
import Footer from "@/app/components/navigation/footer";
import { site } from "@/app/site/SiteData.mjs";
import { currentDate } from "@/app/components/functions/general";
import ImageViewer from "./gallery/ImageViewer";
import CharaState from "./character/CharaState";
import MediaImageState from "@/app/context/MediaImageState";
import SiteState from "./site/SiteState";
import PostState from "./blog/PostState";
import ToasterContext from "@/app/context/toastContext";
import ServerStateMake from "./components/System/ServerStateMake";
import ClientSetup from "./components/System/ClientSetup";
import EmbedSync from "./components/System/EmbedSync";
import { DataStateAddMtime } from "./components/dataState/DataStateFunctions";
import SoundPlayer from "./sound/SoundPlayer";

import {
  KosugiMaruFont,
  MochiyPopOneFont,
  MandaliFont,
  // ZenMaruFont,
  LuloCleanFont,
} from "@/app/fonts/list";
import SoundState from "./sound/SoundState";
import { yamlPath } from "./sound/MediaSoundData.mjs";

export const metadata: Metadata = {
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
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
        <SoundPlayer />
        <ImageViewer />
        <CharaState />
        <SiteState />
        <MediaImageState
          url={DataStateAddMtime({ url: "/data/images.json" })}
        />
        <SoundState
          url={DataStateAddMtime({
            url: "/data/sound.json",
            file: yamlPath,
          })}
        />
        <PostState
          url={DataStateAddMtime({
            url: "/blog/posts.json",
            file: "_data/post.json",
          })}
        />
        <Header site={site} />
        <div className="pt-16 pb-8 text-center font-KosugiMaru">
          <div className="mx-auto content-parent min-h-[70vh]">
            {children}
            <Footer site={site} currentDate={currentDate} />
          </div>
        </div>
        <div id="audio_background"></div>
      </body>
    </html>
  );
}

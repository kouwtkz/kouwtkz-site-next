import type { Metadata } from "next";
import "./globals.scss";
import {
  KosugiMaruFont,
  MochiyPopOneFont,
  MandaliFont,
  // ZenMaruFont,
  LuloCleanFont,
} from "@/app/fonts/list";
import Header from "@/app/components/navigation/header";
import Footer from "@/app/components/navigation/footer";
import { site } from "@/app/site/SiteData.mjs";
import { currentDate } from "@/app/components/functions/general";
import ImageViewer from "./gallery/ImageViewer";
import ToasterContext from "@/app/context/toastContext";
import ServerStateMake from "./components/System/ServerStateMake";
import ClientSetup from "./components/System/ClientSetup";
import EmbedSync from "./components/System/EmbedSync";
import SoundPlayer from "./sound/SoundPlayer";
import DataState from "./context/update/DataState";
import { WithContext, WebSite } from "schema-dts";

export const metadata: Metadata = {
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
  description: site.description,
  openGraph: {
    title: {
      template: `%s | ${site.title}`,
      default: site.title,
    },
    description: site.description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd: WithContext<WebSite> = {
    "@type": "WebSite",
    "@context": "https://schema.org",
    url: site.url,
    name: site.title,
    alternateName: site.author.name,
  };
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToasterContext />
        <ClientSetup />
        <EmbedSync />
        <ServerStateMake />
        <SoundPlayer />
        <ImageViewer />
        <DataState />
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

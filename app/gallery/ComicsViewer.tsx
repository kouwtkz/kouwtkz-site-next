"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ComicViewer from "react-comic-viewer";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import Link from "next/link";
import ePub from "epubjs";
import useWindowSize from "@/app/components/hook/useWindowSize";
import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";
import { useHotkeys } from "react-hotkeys-hook";

interface ePubMetadataType {
  title?: string;
  creator?: string;
  description?: string;
  direction?: "rtl" | "ltr";
  pubdate?: string;
  publisher?: string;
  identifier?: string;
  language?: string;
  rights?: string;
  modified_date?: string;
  layout?: string;
  orientation?: string;
  flow?: string;
  viewport?: string;
  spread?: string;
}

export function ComicsViewer({ src }: { src: string }) {
  if (/\.epub$/i.test(src)) {
    return <EPubViewer url={src} />;
  } else return <AlbumComicsViewer name={src} />;
}

export function AlbumComicsViewer({ name }: { name: string }) {
  const { imageAlbumList } = useMediaImageState();
  const album: MediaImageAlbumType | undefined = useMemo(
    () => imageAlbumList.find((album) => album.name.endsWith(name)),
    [name, imageAlbumList]
  );
  const pages: Array<string | null> =
    album?.list
      .filter((image) => image.dir?.startsWith("/content"))
      .map((image) => image.URL || "") || [];
  const metadata: ePubMetadataType = {};
  if (album?.direction) metadata.direction = album.direction;
  return <Viewer pages={pages} metadata={metadata} />;
}
export function EPubViewer({ url }: { url: string }) {
  const [srcList, setSrcList] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<ePubMetadataType | null>(null);
  useEffect(() => {
    const book = ePub(url);
    const rendition = book.renderTo("area");
    rendition.display().then(() => {
      setMetadata(book.packaging.metadata);
      const resources = book.resources as any;
      if ("assets" in resources) {
        const assets = resources.assets as any[];
        const newAssets = assets
          .map((asset, i) => ({
            url: resources.replacementUrls[i] as string,
            ...asset,
          }))
          .filter(({ type }) => type.startsWith("image"));
        const pages = newAssets.map(({ type, url, href }, i) =>
          type.startsWith("image") ? (
            url
          ) : (
            <iframe
              style={{ width: "100%", height: "100%", margin: "auto" }}
              title={href}
              key={i}
              src={url}
            />
          )
        );
        setSrcList(pages);
      }
    });
  }, [url]);
  return (
    <>
      <div id="area" style={{ display: "none" }} />
      <Viewer pages={srcList} metadata={metadata} />
    </>
  );
}

function Viewer({
  pages,
  metadata: mt,
}: {
  pages: any[];
  metadata?: ePubMetadataType | null;
}) {
  const nRef = useRef(0);
  const [w] = useWindowSize();
  const double = w > 984;
  const _pages = useMemo(() => {
    if (double) return [<div key="cover" />].concat(pages);
    else return pages;
  }, [double, pages]);
  const toNext = useCallback(() => {
    if (_pages.length !== nRef.current + 1) {
      const pagingElm = document.querySelector(
        `.react-comic-viewer a[direction]:nth-of-type(1)`
      );
      if (pagingElm) (pagingElm as HTMLAnchorElement).click();
    }
  }, [_pages.length]);
  const toPrev = useCallback(() => {
    if (nRef.current > 0) {
      const pagingElm = document.querySelector(
        `.react-comic-viewer a[direction]:nth-last-of-type(1)`
      );
      if (pagingElm) (pagingElm as HTMLAnchorElement).click();
    }
  }, []);
  useHotkeys("left", () => {
    if (mt?.direction === "ltr") toPrev();
    else toNext();
  });
  useHotkeys("right", () => {
    if (mt?.direction === "ltr") toNext();
    else toPrev();
  });
  return (
    <>
      <div className="react-comic-viewer">
        <ComicViewer
          pages={_pages}
          direction={mt?.direction}
          onChangeCurrentPage={(n) => (nRef.current = n)}
          text={{
            expansion: "かくだい",
            fullScreen: "ぜんがめん",
            move: "いどう",
            normal: "もとにもどす",
          }}
        />
      </div>
      <div className="mt-6 [&_*]:mx-2">
        {mt === null ? (
          <span>よみこみちゅう…</span>
        ) : mt ? (
          <>
            {mt.title ? <span>{mt.title}</span> : null}
            {mt.title && mt.creator ? <span>-</span> : null}
            {mt.creator ? <span>{mt.creator}</span> : null}
          </>
        ) : null}
      </div>
      <div className="mt-6">
        <p>
          Powered by{" "}
          <Link
            href="https://www.npmjs.com/package/react-comic-viewer"
            target="_blank"
          >
            react-comic-viewer
          </Link>
          {" & "}
          <Link href="https://www.npmjs.com/package/epubjs" target="_blank">
            Epub.js
          </Link>
        </p>
      </div>
    </>
  );
}

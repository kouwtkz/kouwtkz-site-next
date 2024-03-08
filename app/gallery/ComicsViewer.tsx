"use client";

import React, {
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
import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";
import { useHotkeys } from "react-hotkeys-hook";
import { getEmbedURL } from "../context/embed/Embed";
import { pdfjs } from "react-pdf";
import { PDFPageProxy } from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

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
  } else if (/\.pdf$/i.test(src)) {
    return <PdfViewer url={src} />;
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
  return <Viewer pages={pages} metadata={metadata} type="album" />;
}
export function EPubViewer({ url }: { url: string }) {
  const [srcList, setSrcList] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<ePubMetadataType | null>(null);
  useEffect(() => {
    const book = ePub(getEmbedURL(url));
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
      <Viewer pages={srcList} metadata={metadata} type="epub" />
    </>
  );
}
function PdfPage({ page: p_page }: { page: Promise<PDFPageProxy> }) {
  const [page, setPage] = useState<PDFPageProxy>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  p_page.then((page) => {
    setPage(page);
  });
  const scale = 1.0;
  const viewport = page?.getViewport({ scale });
  useEffect(() => {
    if (page && viewport && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        page.render(renderContext);
      }
    }
  }, [page, viewport]);
  if (!page || !viewport) return;
  const outputScale = window.devicePixelRatio || 1;
  return (
    <canvas
      ref={canvasRef}
      width={Math.floor(viewport.width * outputScale)}
      height={Math.floor(viewport.height * outputScale)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}
function PdfViewer({ url }: { url: string }) {
  const [pages, setPages] = useState<Promise<PDFPageProxy>[]>([]);
  const [metadata, setMetadata] = useState<ePubMetadataType | null>(null);
  useEffect(() => {
    pdfjs.getDocument(getEmbedURL(url)).promise.then((pdf) => {
      pdf.getMetadata().then(({ info: _info }) => {
        const info = _info as { [k: string]: string | undefined };
        setMetadata({
          creator: info.Author,
          title: info.Title,
          direction: "ltr",
          description: info.Subject,
        });
      });
      setPages(
        new Array(pdf.numPages).fill(0).map((n, i) => pdf.getPage(i + 1))
      );
    });
  }, [url]);
  const srcList = useMemo(() => {
    return pages.map((page, i) => <PdfPage page={page} key={i} />);
  }, [pages]);
  return <Viewer pages={srcList} metadata={metadata} type="pdf" fix={false} />;
}

function Viewer({
  pages,
  type,
  fix = true,
  metadata,
}: {
  pages: any[];
  fix?: boolean;
  type?: "epub" | "pdf" | "album";
  metadata?: ePubMetadataType | null;
}) {
  const nRef = useRef(0);
  const [divHeight, setDivHeight] = useState<number>();
  const [fixCover, setFixCover] = useState(false);
  const rcvRef = useRef<HTMLDivElement>(null);
  const rcv = rcvRef.current;
  const [divElm, setDivElm] = useState<Element | null>();
  useEffect(() => {
    setDivElm(rcv?.querySelector(`div[height]`));
  }, [rcv]);
  useEffect(() => {
    if (!divElm) return;
    const updateSize = () => {
      const h = divElm.getAttribute("height");
      if (h) setDivHeight(Number(h));
    };
    updateSize();
    const observer = new MutationObserver(updateSize);
    observer.observe(divElm, {
      attributes: true,
      attributeFilter: ["height"],
    });
    return () => {
      observer.disconnect();
    };
  }, [divElm]);
  const [setedFixCover, setSetedFixCover] = useState(false);
  useEffect(() => {
    if (!divElm) return;
    const updateSize = (setedFix = false): void => {
      if (divHeight) {
        setFixCover(divElm.clientWidth >= divHeight);
        if (setedFix) setSetedFixCover(true);
      }
    };
    updateSize(true);
    window.addEventListener("resize", () => updateSize());
    return () => {
      window.removeEventListener("resize", () => updateSize());
    };
  }, [divHeight, divElm]);
  const [setedMetadata, setSetedMetadata] = useState(false);
  useEffect(() => {
    if (metadata) setSetedMetadata(true);
  }, [metadata]);

  const _pages = useMemo(() => {
    if (!setedFixCover || !setedMetadata) return [];
    if (fix && fixCover) return [<div key="cover" />].concat(pages);
    else return pages;
  }, [fix, fixCover, pages, setedFixCover, setedMetadata]);
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
    if (metadata?.direction === "ltr") toPrev();
    else toNext();
  });
  useHotkeys("right", () => {
    if (metadata?.direction === "ltr") toNext();
    else toPrev();
  });

  return (
    <>
      <div
        className={"react-comic-viewer" + (setedFixCover ? "" : " loading")}
        ref={rcvRef}
      >
        <ComicViewer
          pages={_pages}
          direction={metadata?.direction}
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
        {metadata === null ? (
          <span>よみこみちゅう…</span>
        ) : metadata ? (
          <>
            {metadata.title ? <span>{metadata.title}</span> : null}
            {metadata.title && metadata.creator ? <span>-</span> : null}
            {metadata.creator ? <span>{metadata.creator}</span> : null}
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
          {type === "epub" ? (
            <>
              {" & "}
              <Link href="https://www.npmjs.com/package/epubjs" target="_blank">
                Epub.js
              </Link>
            </>
          ) : null}
          {type === "pdf" ? (
            <>
              {" & "}
              <Link
                href="https://www.npmjs.com/package/react-pdf"
                target="_blank"
              >
                react-pdf
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </>
  );
}

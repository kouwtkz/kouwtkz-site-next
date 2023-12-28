"use client";

import React, { Suspense } from "react";
import ComicViewer from "react-comic-viewer";
import { useMediaImageState } from "@/app/context/MediaImageState";
import { useSearchParams } from "next/navigation";
import ComicsList from "./ComicsList";
import Link from "next/link";

function App() {
  const { imageAlbumList } = useMediaImageState();
  const search = useSearchParams();
  const comicName = search.get("name");
  if (!comicName) return <ComicsList />;
  const album = imageAlbumList.find((album) => album.name === comicName);
  if (!album) return <></>;

  const pages: Array<string | null> = album.list
    .filter((image) => image.tags?.some((tag) => tag === "content"))
    .map((image) => image.URL || "");
  return (
    <>
      {album ? (
        <>
          <div className="react-comic-viewer">
            <ComicViewer
              pages={pages}
              text={{
                expansion: "かくだい",
                fullScreen: "ぜんがめん",
                move: "いどう",
                normal: "もとにもどす",
              }}
            />
          </div>
          <div className="pt-12">
            <p>
              Powered by{" "}
              <Link href="https://www.npmjs.com/package/react-comic-viewer">
                react-comic-viewer
              </Link>
            </p>
          </div>
        </>
      ) : null}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <App />
    </Suspense>
  );
}

"use client";

import React, { Suspense } from "react";
import ComicViewer from "react-comic-viewer";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GalleryObject from "../GalleryObject";

function App() {
  const { imageAlbumList } = useMediaImageState();
  const search = useSearchParams();
  const comicName = search.get("name");
  if (!comicName)
    return (
      <GalleryObject
        items={{
          name: "comics",
          match: "fanbook",
          format: "comic",
        }}
        max={40}
        step={28}
        label="fanbook"
        linkLabel={false}
        filterButton={true}
      />
    );
  const album = imageAlbumList.find((album) => album.name.endsWith(comicName));
  if (!album) return <></>;

  const pages: Array<string | null> = album.list
    .filter((image) => image.dir?.startsWith("/content"))
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
              <Link
                href="https://www.npmjs.com/package/react-comic-viewer"
                target="_blank"
              >
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

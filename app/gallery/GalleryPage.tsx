"use client";

import React from "react";
import GalleryList from "./GalleryList";
import { useMediaImageState } from "@/app/context/MediaImageState";
import ComicsList from "./comics/ComicsList";

export default function GalleryPage() {
  const { imageAlbumList } = useMediaImageState();
  return (
    <div className="">
      {["art", "fanart", "works"].map((name, i) => {
        const groupAlbum =
          imageAlbumList.find((album) => album.name === name) || null;
        return (
          <GalleryList
            key={i}
            album={groupAlbum}
            max={20}
            filterButton={true}
          />
        );
      })}
      <ComicsList />
    </div>
  );
}

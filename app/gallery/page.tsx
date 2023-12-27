"use client";

import React from "react";
import GalleryList from "./GalleryList";
import { useMediaImageState } from "@/app/context/MediaImageState";

export default function Home() {
  const { imageAlbumList } = useMediaImageState();
  return (
    <div className="">
      {["art", "fanart", "works"].map((name, i) => {
        const groupAlbum = imageAlbumList.find(album => album.name === name) || null;
        return <GalleryList key={i} album={groupAlbum} max={20} />;
      })}
    </div>
  );
}

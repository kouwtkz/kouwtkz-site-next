"use client"

import React from "react";
import { getImageAlbum } from "@/app/media/image/MediaImageData.mjs";
import GalleryList from "@/app/gallery/GalleryList";
import { useMediaImageState } from "@/app/media/image/MediaImageState";

export default function Home() {
  const { imageAlbumList } = useMediaImageState();
  return (
    <div className="pt-8">
      <h2 className="my-4 text-4xl text-main font-MochiyPopOne">
        描いてくれてありがとめぇ！
      </h2>
      <h4 className="text-main-soft">#わたかぜメ絵</h4>
      {["given"].map(async (name, i) => {
        const groupAlbum =
          imageAlbumList.find((album) => album.name === name) || null;
        return <GalleryList key={i} label="FANART" album={groupAlbum} />;
      })}
    </div>
  );
}

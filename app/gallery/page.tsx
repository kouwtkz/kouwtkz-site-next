import React from "react";
import { getImageAlbum } from "@/app/media/MediaImageData.mjs";
import GalleryList from "./GalleryList";

export default async function Home() {
  return (
    <div className="">
      {["art", "fanart", "works"].map((name, i) => {
        return (
          <GalleryList
            key={i}
            group={getImageAlbum({filter: {albumName: name}})}
            max={20}
          />
        );
      })}
    </div>
  );
}

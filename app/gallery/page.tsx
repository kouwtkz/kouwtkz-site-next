import React from "react";
import { getImageAlbum } from "@/app/media/MediaImageData.mjs";
import GalleryList from "./GalleryList";
import { isStatic } from "@/app/functions/general";

export default function Home() {
  return (
    <div className="">
      {["art", "fanart", "works"].map((name, i) => {
        return (
          <GalleryList
            key={i}
            group={getImageAlbum({filter: {albumName: name}})}
            max={20}
            isStatic={isStatic}
          />
        );
      })}
    </div>
  );
}

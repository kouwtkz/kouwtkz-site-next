import React from "react";
import { getImageAlbum } from "@/media/scripts/MediaImageData.mjs";
import GalleryList from "@/app/components/gallery/GalleryList";
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

import React from "react";
import { imageDataGroupMap } from "@/media/scripts/MediaData";
import GalleryList from "@/app/components/gallery/GalleryList";
import { isStatic } from "@/siteData/site";

export default function Home() {
  return (
    <div className="">
      {["art", "fanart", "works", "given"].map((name, i) => {
        return (
          <GalleryList
            key={i}
            group={imageDataGroupMap.get(name) || null}
            max={20}
            isStatic={isStatic}
          />
        );
      })}
    </div>
  );
}

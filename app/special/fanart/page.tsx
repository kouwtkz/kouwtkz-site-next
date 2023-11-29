import React from "react";
import { imageDataGroupMap } from "@/media/scripts/MediaData";
import GalleryList from "@/app/components/gallery/GalleryList";
import { isStatic } from "@/siteData/site";

export default function Home() {
  return (
    <div className="pt-8">
      <h2 className="my-4 text-4xl text-main font-MochiyPopOne">描いてくれてありがとめぇ！</h2>
      <h4 className="text-main-soft">#わたかぜメ絵</h4>
      {["given"].map((name, i) => {
        return (
          <GalleryList
            key={i}
            label="FANART"
            group={imageDataGroupMap.get(name) || null}
            isStatic={isStatic}
          />
        );
      })}
    </div>
  );
}

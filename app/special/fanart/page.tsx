import React from "react";
import { getImageAlbum } from "@/app/media/MediaImageData.mjs";
import GalleryList from "@/app/gallery/GalleryList";
import { isStatic } from "@/app/functions/general";

export default function Home() {
  return (
    <div className="pt-8">
      <h2 className="my-4 text-4xl text-main font-MochiyPopOne">
        描いてくれてありがとめぇ！
      </h2>
      <h4 className="text-main-soft">#わたかぜメ絵</h4>
      {["given"].map((name, i) => {
        return (
          <GalleryList
            key={i}
            label="FANART"
            group={getImageAlbum({ filter: { albumName: name } })}
            isStatic={isStatic}
          />
        );
      })}
    </div>
  );
}

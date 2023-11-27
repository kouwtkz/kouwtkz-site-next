import React from "react";
import { imageDataGroupMap } from "@/media/scripts/MediaData";
import GalleryList from "@/app/components/gallery/GalleryList"

export default function Home() {
  return (
    <div className="">
      <GalleryList group={imageDataGroupMap.get("art") || null} max={20} />
      <GalleryList group={imageDataGroupMap.get("fanart") || null} max={20} />
      <GalleryList group={imageDataGroupMap.get("works") || null} max={20} />
      <GalleryList group={imageDataGroupMap.get("given") || null} max={20} />
    </div>
  );
}

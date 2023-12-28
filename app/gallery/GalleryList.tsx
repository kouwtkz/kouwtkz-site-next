"use client";

import { MediaImageAlbumType } from "@/imageScripts/MediaImageType";
import { useImageViewer } from "@/app/gallery/ImageViewer";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ImageMee from "../components/image/ImageMee";
import MoreButton from "../components/svg/MoreButton";
type GalleryPageProps = {
  album: MediaImageAlbumType | null;
  size?: number;
  label?: string;
  showLabel?: boolean;
  max?: number;
  step?: number;
  autoDisable?: boolean;
};

const GalleryList = ({
  album,
  label,
  size = 320,
  showLabel = true,
  max = 1000,
  step = 20,
  autoDisable = false,
}: GalleryPageProps) => {
  const router = useRouter();
  const [curMax, setCurMax] = useState(max);
  const showMoreButton = curMax < (album?.list.length || 0);
  const visibleMax = showMoreButton ? curMax - 1 : curMax;
  if (!album || (autoDisable && album.list.length === 0)) return null;
  return (
    <div className="w-[100%]">
      {showLabel ? (
        <h2 className="pt-12 mb-6 text-4xl font-LuloClean text-center text-main">
          {label || album.name}
        </h2>
      ) : null}
      <div
        className={`max-w-[1120px] mx-auto select-none flex flex-wrap${
          album.list.length < 3 ? " justify-center" : ""
        }`}
      >
        {album.list
          .map((image, key) => {
            return (
              <div
                key={key}
                className={
                  `w-[24.532%] pt-[24.532%] m-[0.234%] relative overflow-hidden` +
                  ` hover:brightness-90 transition cursor-pointer`
                }
              >
                <ImageMee
                  imageItem={image}
                  mode="thumbnail"
                  style={{ objectFit: "cover" }}
                  className="absolute w-[100%] h-[100%] top-0 hover:scale-[1.03] transition"
                  onClick={() => {
                    if (image.direct) router.push(image.direct);
                    else router.push(`?image=${image.path}`, { scroll: false });
                  }}
                />
              </div>
            );
          })
          .filter((v, i) => i < visibleMax)}
        {showMoreButton ? (
          <MoreButton
            className="w-[24.532%] h-auto cursor-pointer m-[0.234%] p-0 fill-main-soft hover:fill-main-pale"
            onClick={() => {
              setCurMax(curMax + step);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GalleryList;

"use client";

import { MediaImageAlbumType } from "@/imageScripts/MediaImageDataType";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageMeeThumbnail } from "../components/image/ImageMee";
import MoreButton from "../components/svg/button/MoreButton";
type GalleryPageProps = {
  album: MediaImageAlbumType | null;
  size?: number;
  label?: string;
  showLabel?: boolean;
  max?: number;
  step?: number;
  autoDisable?: boolean;
  filterButton?: boolean;
};

function getYear(date?: Date | null) {
  return date?.toLocaleString("ja", { timeZone: "JST" }).split("/", 1)[0];
}
function getYears(dates: (Date | null | undefined)[]) {
  return Array.from(new Set(dates.map((date) => getYear(date))));
}

export default function GalleryList({
  album,
  label,
  size = 320,
  showLabel = true,
  max = 1000,
  step = 20,
  autoDisable = false,
  filterButton = false,
}: GalleryPageProps) {
  const router = useRouter();
  const [curMax, setCurMax] = useState(max);
  const yearSelectRef = useRef<HTMLSelectElement>(null);
  const [year, setYear] = useState("");
  if (!album || (autoDisable && album.list.length === 0)) return null;
  let albumList = album.list.sort(
    (a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0)
  );
  if (year) {
    albumList = albumList.filter((item) => getYear(item.time) === year);
  }
  const showMoreButton = curMax < (albumList.length || 0);
  const visibleMax = showMoreButton ? curMax - 1 : curMax;
  return (
    <div className="w-[100%]">
      <div className="pt-12 mx-4 relative">
        {filterButton ? (
          <div>
            <select
              title="フィルタリング"
              className="text-main [&_option]:text-main-dark absolute right-0 text-xl m-2 h-6 min-w-[4rem] bg-transparent"
              ref={yearSelectRef}
              onChange={() => {
                if (yearSelectRef.current) setYear(yearSelectRef.current.value);
              }}
            >
              <option value=""></option>
              {getYears(album.list.map((item) => item.time)).map((year, i) => (
                <option key={i} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showLabel ? (
          <h2 className=" mb-6 font-LuloClean text-3xl sm:text-4xl text-center text-main">
            {label || album.name}
          </h2>
        ) : null}
      </div>
      <div
        className={`max-w-[1120px] mx-auto select-none flex flex-wrap${
          albumList.length < 3 ? " justify-center" : ""
        }`}
      >
        {albumList
          .map((image, key) => {
            return (
              <div
                key={key}
                className={
                  `w-[24.532%] pt-[24.532%] m-[0.234%] relative overflow-hidden` +
                  ` hover:brightness-90 transition cursor-pointer`
                }
              >
                <ImageMeeThumbnail
                  imageItem={image}
                  style={{ objectFit: "cover" }}
                  className="absolute w-[100%] h-[100%] top-0 hover:scale-[1.03] transition"
                  onClick={() => {
                    if (image.direct) router.push(image.direct);
                    else router.push(`?image=${image.URL}`, { scroll: false });
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
}

"use client";

import { MediaImageAlbumType } from "@/MediaScripts/MediaImageDataType";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageMeeThumbnail } from "../components/image/ImageMee";
import MoreButton from "../components/svg/button/MoreButton";
import Link from "next/link";
export interface GalleryListPropsBase {
  size?: number;
  h2?: string;
  h4?: string;
  label?: string;
  showLabel?: boolean;
  linkLabel?: boolean | string;
  max?: number;
  step?: number;
  autoDisable?: boolean;
  filterButton?: boolean;
}

interface GalleryListProps extends GalleryListPropsBase {
  album: MediaImageAlbumType | null;
  loading?: boolean;
}

function getYear(date?: Date | null) {
  return date?.toLocaleString("ja", { timeZone: "JST" }).split("/", 1)[0];
}
function getYears(dates: (Date | null | undefined)[]) {
  return Array.from(new Set(dates.map((date) => getYear(date))));
}

export function GalleryList({
  album,
  label,
  size = 320,
  showLabel = true,
  linkLabel = false,
  max = 1000,
  step = 20,
  autoDisable = false,
  filterButton = false,
  loading = false,
  h2: _h2,
  h4: _h4,
}: GalleryListProps) {
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
  const heading = label || album.name;
  const headingElm = linkLabel ? (
    <Link
      href={
        typeof linkLabel === "string"
          ? linkLabel
          : `/gallery/${album.group || album.name}`
      }
    >
      {heading}
    </Link>
  ) : (
    <>{heading}</>
  );
  return (
    <>
      {_h2 || _h4 ? (
        <div className="pt-6 pb-2">
          {_h2 ? (
            <h2 className="my-4 text-4xl text-main font-MochiyPopOne">{_h2}</h2>
          ) : null}
          {_h4 ? <h4 className="text-main-soft">{_h4}</h4> : null}
        </div>
      ) : null}
      <div className="pt-6 pb-6 w-[100%]">
        <div className="mx-4 relative">
          {filterButton ? (
            <div>
              <select
                title="フィルタリング"
                className="text-main [&_option]:text-main-dark absolute right-0 text-xl m-2 h-6 min-w-[4rem] bg-transparent"
                ref={yearSelectRef}
                onChange={() => {
                  if (yearSelectRef.current)
                    setYear(yearSelectRef.current.value);
                }}
              >
                <option value="">all</option>
                {getYears(album.list.map((item) => item.time)).map(
                  (year, i) => (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          ) : null}
          {showLabel ? (
            <h2 className=" mb-6 font-LuloClean text-3xl sm:text-4xl text-center text-main">
              {headingElm}
            </h2>
          ) : null}
        </div>
        <div
          className={`max-w-[1120px] mx-auto select-none flex flex-wrap${
            albumList.length < 3 ? " justify-center" : ""
          }`}
        >
          {loading ? (
            <div className="text-main-soft my-4">よみこみちゅう…</div>
          ) : (
            <>
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
                          else
                            router.push(`?image=${image.URL}`, {
                              scroll: false,
                            });
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

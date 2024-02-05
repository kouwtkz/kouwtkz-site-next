"use client";

import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";

import React, { Suspense, useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageMeeThumbnail } from "../components/image/ImageMee";
import MoreButton from "../components/svg/button/MoreButton";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useServerState } from "../components/System/ServerState";
import { useMediaImageState } from "../context/MediaImageState";
import { upload } from "./send/uploadFunction";
import { queryPush } from "@/app/components/functions/queryPush";
import { filterImagesTags } from "./FilterImages";
import { filterMonthList } from "./tag/GalleryTags";

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
  tags?: string | string[];
}

interface GalleryListProps extends GalleryListPropsBase {
  album: MediaImageAlbumType | null;
  loading?: boolean;
  hideWhenFilter?: boolean;
}

function getYear(date?: Date | null) {
  return date?.toLocaleString("ja", { timeZone: "JST" }).split("/", 1)[0];
}
function getYearObjects(dates: (Date | null | undefined)[]) {
  return dates
    .map((date) => getYear(date))
    .reduce((a, c) => {
      const g = a.find(({ year }) => c === year);
      if (g) g.count++;
      else if (c) a.push({ year: c, count: 1 });
      return a;
    }, [] as { year: string; count: number }[]);
}

export default function GalleryList(args: GalleryListProps) {
  return (
    <Suspense>
      <Main {...args} />
    </Suspense>
  );
}

function Main({
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
  hideWhenFilter = false,
  tags = [],
  h2: _h2,
  h4: _h4,
}: GalleryListProps) {
  const { setImageFromUrl } = useMediaImageState();
  const { isServerMode } = useServerState();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (album)
        upload({
          isServerMode,
          album,
          files: acceptedFiles,
          setImageFromUrl,
          tags,
        });
    },
    [isServerMode, album, setImageFromUrl, tags]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const router = useRouter();
  const search = useSearchParams();
  const yearSelectRef = useRef<HTMLSelectElement>(null);
  const [curMax, setCurMax] = useState(max);
  if (!album || (autoDisable && album.list.length === 0)) return null;
  let albumList = album.list.sort(
    (a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0)
  );
  let afterFilter = false;
  let monthlyEventMode = true;
  const searchFilter = search.get("filter");
  if (searchFilter) {
    if (hideWhenFilter) return <></>;
    else {
      afterFilter = true;
      switch (searchFilter) {
        case "topImage":
        case "pickup":
          albumList = albumList.filter((item) => item[searchFilter]);
          break;
        case "monthlyOnly":
          monthlyEventMode = false;
          break;
        default:
          albumList = [];
          break;
      }
    }
  }
  const month = search.get("month");
  if (month) {
    if (hideWhenFilter) return <></>;
    else {
      afterFilter = true;
      const filterMonthly = filterMonthList.find(
        (v) => String(v.month) === month
      );
      if (filterMonthly) {
        if (monthlyEventMode) {
          albumList = filterImagesTags({
            images: albumList,
            tags: filterMonthly.tags,
            every: false,
          });
        } else {
          albumList = filterImagesTags({
            images: albumList,
            tags: filterMonthly.tags.filter((v, i) => i === 0),
          });
        }
      }
    }
  }
  const searchTag = search.get("tag");
  if (searchTag) {
    if (hideWhenFilter) return <></>;
    else {
      afterFilter = true;
      albumList = filterImagesTags({
        images: albumList,
        tags: searchTag.split(","),
      });
    }
  }
  const searches = search
    .get("q")
    ?.split(" ", 3)
    .map((q) => {
      const qs = q.split(":");
      const key = qs.length > 1 ? qs[0] : "keyword";
      const value = qs.length > 1 ? qs[1] : qs[0];
      const option = qs.length > 2 ? qs[2] : undefined;
      return { key, value, option };
    });
  if (searches) {
    if (hideWhenFilter) return <></>;
    else {
      afterFilter = true;
      albumList = albumList.filter((image) => {
        const ImageDataStr = [
          image.name,
          image.description,
          image.src,
          image.copyright,
        ]
          .concat(image.tags)
          .join(" ");
        return searches.every(({ key, value, option }) => {
          switch (key) {
            case "tag":
              return image.tags?.some((tag) => {
                switch (option) {
                  case "match":
                    return tag.match(value);
                  default:
                    return tag === value;
                }
              });
            case "name":
            case "description":
            case "URL":
            case "copyright":
              const imageValue = image[key];
              if (imageValue) return imageValue.match(value);
              else return false;
            default:
              return ImageDataStr.match(value);
          }
        });
      });
    }
  }
  const year = search.get("year");
  const yearList = getYearObjects(albumList.map((item) => item.time));
  if (year) {
    afterFilter = true;
    albumList = albumList.filter((item) => getYear(item.time) === year);
  }
  if (!loading && afterFilter && albumList.length === 0) return <></>;

  const sortList: { key: string; order: "asc" | "desc" }[] = [];
  const searchSort = search.get("sort") || "";
  switch (searchSort) {
    case "recently":
      sortList.push({ key: "time", order: "desc" });
      break;
    case "leastRecently":
      sortList.push({ key: "time", order: "asc" });
      break;
    case "nameOrder":
      sortList.push({ key: "name", order: "asc" });
      break;
    case "leastNameOrder":
      sortList.push({ key: "name", order: "desc" });
      break;
  }
  if (sortList.every(({ key }) => key !== "time"))
    sortList.unshift({ key: "time", order: "desc" });
  if (sortList.every(({ key }) => key !== "name"))
    sortList.unshift({ key: "name", order: "asc" });
  sortList.forEach(({ key, order }) => {
    switch (key) {
      case "time":
        albumList.sort((a, b) => {
          const atime = a.time?.getTime() || 0;
          const btime = b.time?.getTime() || 0;
          if (atime === btime) return 0;
          else {
            const result = atime > btime;
            return (order === "asc" ? result : !result) ? 1 : -1;
          }
        });
        break;
      default:
        albumList.sort((a, b) => {
          if (a[key] === b[key]) return 0;
          const result = a[key] > b[key];
          return (order === "asc" ? result : !result) ? 1 : -1;
        });
    }
  });

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
            <h2 className="my-4 text-2xl md:text-3xl text-main font-MochiyPopOne">
              {_h2}
            </h2>
          ) : null}
          {_h4 ? <h4 className="text-main-soft">{_h4}</h4> : null}
        </div>
      ) : null}
      <div className="pt-6 pb-6 w-[100%]" {...getRootProps()}>
        <input name="upload" {...getInputProps()} />
        <div className="mx-2 relative">
          {filterButton ? (
            <div>
              <select
                title="フィルタリング"
                className="text-main [&_option]:text-main-dark absolute right-0 text-lg m-2 h-6 min-w-[4rem] bg-transparent"
                ref={yearSelectRef}
                value={year || ""}
                onChange={() => {
                  if (yearSelectRef.current) {
                    const yearSelect = yearSelectRef.current;
                    queryPush({
                      process: (params) => {
                        if (yearSelect.value) params.year = yearSelect.value;
                        else delete params.year;
                      },
                      scroll: false,
                      push: router.push,
                      search,
                    });
                  }
                }}
              >
                <option value="">
                  all ({yearList.reduce((a, c) => a + c.count, 0)})
                </option>
                {yearList.map(({ year, count }, i) => (
                  <option key={i} value={year}>
                    {year} ({count})
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {showLabel ? (
            <h2 className=" mb-6 font-LuloClean text-2xl sm:text-3xl text-center text-main-strong">
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
                          else {
                            if (image.URL !== undefined) {
                              const URL = image.URL;
                              queryPush({
                                process: (params) => ({
                                  image: URL,
                                  ...params,
                                }),
                                scroll: false,
                                push: router.push,
                                search,
                              });
                            }
                          }
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

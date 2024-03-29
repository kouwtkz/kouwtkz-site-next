"use client";

import {
  MediaImageAlbumType,
  MediaImageItemType,
} from "@/mediaScripts/MediaImageDataType";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageMeeThumbnail } from "../components/tag/ImageMee";
import MoreButton from "../components/svg/button/MoreButton";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useServerState } from "../context/system/ServerState";
import { useMediaImageState } from "../context/image/MediaImageState";
import { upload } from "./send/uploadFunction";
import { MakeURL } from "@/app/components/functions/MakeURL";
import { filterImagesTags } from "./FilterImages";
import { filterMonthList } from "./tag/GalleryTags";
import { useImageViewer } from "./ImageViewer";
import { RiBook2Fill } from "react-icons/ri";

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
  const { imageItemList, setImageFromUrl } = useMediaImageState();
  const { isServerMode } = useServerState();
  const { groupImages: albumImages, setGroupImages: setAlbumImages } =
    useImageViewer();
  const refImages = useRef<MediaImageItemType[]>([]);

  useEffect(() => {
    const groupName = search.get("group") || search.get("album");
    if (album?.name === groupName && albumImages.length === 0) {
      const URLList = refImages.current
        .map(({ URL }) => URL || "")
        .filter((URL) => URL);
      if (URLList.length > 0) setAlbumImages(URLList);
    }
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (album)
        upload({
          isServerMode,
          imageItemList,
          album: album,
          files: acceptedFiles,
          setImageFromUrl,
          tags,
        });
    },
    [album, isServerMode, imageItemList, setImageFromUrl, tags]
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
  const itemType = search.get("type");
  if (itemType) {
    if (hideWhenFilter) return <></>;
    afterFilter = true;
    albumList = albumList.filter(({ type }) => type === itemType);
  }
  const month = search.get("month");
  if (month) {
    if (hideWhenFilter) return <></>;
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
  const searchTag = search.get("tag");
  if (searchTag) {
    if (hideWhenFilter) return <></>;
    afterFilter = true;
    albumList = filterImagesTags({
      images: albumList,
      tags: searchTag.split(","),
    });
  }
  const searches = search
    .get("q")
    ?.split(" ", 3)
    .map((q) => {
      const qs = q.split(":");
      if (qs.length === 1 && qs[0].startsWith("#"))
        return {
          key: "hashtag",
          value: qs[0].slice(1),
          reg: new RegExp(`${qs[0]}(\\s|$)`, "i"),
        };
      else {
        const key = qs.length > 1 ? qs[0] : "keyword";
        const value = qs.length > 1 ? qs[1] : qs[0];
        const option = qs.length > 2 ? qs[2] : undefined;
        return { key, value, option };
      }
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
        return searches.every(({ key, value, option, reg }) => {
          switch (key) {
            case "tag":
            case "hashtag":
              let result = false;
              if (key === "hashtag" && image.description)
                result = Boolean(reg?.test(image.description));
              return (
                result ||
                image.tags?.some((tag) => {
                  switch (option) {
                    case "match":
                      return tag.match(value);
                    default:
                      return tag === value;
                  }
                })
              );
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

  refImages.current = albumList;

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
      <div className="gallery-list pt-6 pb-6 w-[100%]" {...getRootProps()}>
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
                    const query = Object.fromEntries(search);
                    if (yearSelect.value) query.year = yearSelect.value;
                    else delete query.year;
                    router.push(MakeURL({ query }).href, { scroll: false });
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
                .filter((_, i) => i < visibleMax)
                .map((image, i) => (
                  <Link
                    key={i}
                    className="gallery-item"
                    prefetch={false}
                    {...(image.direct
                      ? { href: image.direct }
                      : {
                          href: {
                            query: {
                              ...Object.fromEntries(search),
                              image: image.originName,
                              ...(image.album?.name
                                ? { album: image.album.name }
                                : {}),
                              ...(image.album?.name !== album.name
                                ? { group: album.name }
                                : {}),
                            },
                          },
                          scroll: false,
                        })}
                  >
                    <div>
                      {image.type === "ebook" ? (
                        <div className="translucent-comics-button">
                          <RiBook2Fill />
                        </div>
                      ) : null}
                      <ImageMeeThumbnail
                        imageItem={image}
                        loadingScreen={true}
                      />
                    </div>
                  </Link>
                ))}
              {showMoreButton ? (
                <MoreButton
                  className="gallery-button-more"
                  onClick={() => {
                    setCurMax((c) => c + step);
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

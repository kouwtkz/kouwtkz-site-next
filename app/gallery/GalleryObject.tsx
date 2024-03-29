"use client";

import React, { Suspense, createRef } from "react";
import GalleryList, { GalleryListPropsBase } from "./GalleryList";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import { GroupFormat } from "@/mediaScripts/MediaImageYamlType";
import { basename } from "path";
import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";
import InPageMenu from "../components/navigation/InPageMenu";
import { useServerState } from "../context/system/ServerState";
import ArrowUpButton from "../components/svg/button/arrow/ArrowUpButton";
import GalleryTagsSelect from "./tag/GalleryTagsSelect";
import { filterPickFixed } from "./FilterImages";
import GallerySearchArea from "./tag/GallerySearchArea";

export interface GalleryItemObjectType extends GalleryListPropsBase {
  name: string;
  match?: string | RegExp;
  format?: GroupFormat;
}

export type GalleryItemType = string | GalleryItemObjectType;

export type GalleryItemsType = GalleryItemType | GalleryItemType[];

interface GalleryItemProps extends GalleryListPropsBase {
  item: GalleryItemObjectType;
}

function GalleryItem({ item, ...args }: GalleryItemProps) {
  const { imageAlbumList, imageItemList } = useMediaImageState();
  const loading = imageAlbumList.length === 0;
  const { name, match, format = "image", ..._args } = item;
  const setArgs = {
    max: 20,
    filterButton: true,
    linkLabel: true,
    ...args,
    ..._args,
  };
  if (format === "comic") {
    const comicsAlbums = match
      ? imageAlbumList.filter((album) => {
          return (
            album.dir &&
            album.dir.match(match) &&
            album.list.some((img) => img.dir?.startsWith("/content"))
          );
        })
      : imageAlbumList.filter((album) => album.name === name);
    imageAlbumList.find((album) => album.dir?.match(name));
    const thumbnails = comicsAlbums.map((album) => {
      const thumbnail = {
        ...(album.list.find((image) => image.src.startsWith("thumbnail")) ||
          album.list[0]),
      };
      thumbnail.embed = basename(album.name);
      thumbnail.type = "ebook";
      return thumbnail;
    });
    const album: MediaImageAlbumType = { name, list: thumbnails };
    return <GalleryList album={album} loading={loading} {...setArgs} />;
  } else {
    switch (name) {
      case "pickup":
      case "topImage":
        return (
          <GalleryList
            album={{
              list: filterPickFixed({ images: imageItemList, name }),
              name,
            }}
            loading={loading}
            hideWhenFilter={true}
            {...setArgs}
          />
        );
      default:
        let groupAlbum = match
          ? imageAlbumList.find((album) => album.dir?.match(match))
          : imageAlbumList.find((album) => album.name === name);
        if (!groupAlbum) groupAlbum = { name, list: [] };
        return (
          <GalleryList album={groupAlbum} loading={loading} {...setArgs} />
        );
    }
  }
}

interface GalleryObjectProps extends GalleryListPropsBase {
  items?: GalleryItemsType;
}

export default function GalleryObject({
  items = [],
  ...args
}: GalleryObjectProps) {
  const { isServerMode } = useServerState();
  const list = (Array.isArray(items) ? items : [items]).map((item) =>
    typeof item === "string" ? { name: item } : item
  );
  const firstTopRef = createRef<HTMLDivElement>();
  const refList = list.map(() => createRef<HTMLDivElement>());
  return (
    <>
      {list.length > 1 ? (
        <InPageMenu
          list={list.map(({ name, label }, i) => ({
            name: label || name,
            ref: refList[i],
          }))}
          firstTopRef={firstTopRef}
          adjust={128}
        />
      ) : isServerMode ? (
        list.map((item, i) => {
          switch (item.name) {
            case "pickup":
            case "topImage":
              return null;
          }
          return (
            <button
              type="button"
              key={i}
              className="plain fixed z-30 right-0 bottom-0 m-4 cursor-pointer"
              title="アップロードする"
              onClick={() => {
                const uploadElm =
                  document.querySelector(`input[name="upload"]`);
                if (uploadElm) (uploadElm as HTMLInputElement).click();
              }}
            >
              <ArrowUpButton className="fill-main-soft hover:fill-main m-0" />
            </button>
          );
        })
      ) : null}
      <div ref={firstTopRef}>
        <Suspense>
          <div className="m-1 [&>*]:m-1 flex flex-wrap justify-end items-center">
            <GallerySearchArea />
            <GalleryTagsSelect />
          </div>
        </Suspense>
        {list.map((item, i) => (
          <div key={i} ref={refList[i]}>
            <GalleryItem item={item} {...args} />
          </div>
        ))}
      </div>
    </>
  );
}

"use client";

import React, { RefObject, createRef, useRef } from "react";
import GalleryList, { GalleryListPropsBase } from "./GalleryList";
import { useMediaImageState } from "@/app/context/MediaImageState";
import { GroupFormat } from "@/mediaScripts/MediaImageYamlType";
import { basename } from "path";
import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";
import InPageMenu from "../components/navigation/InPageMenu";
import { useServerState } from "../components/System/ServerState";
import ArrowUpButton from "../components/svg/button/arrow/ArrowUpButton";

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
  const { imageAlbumList } = useMediaImageState();
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
      thumbnail.direct = `/gallery/comics?name=${basename(album.name)}`;
      return thumbnail;
    });
    const album: MediaImageAlbumType = { name, list: thumbnails };
    return <GalleryList album={album} loading={loading} {...setArgs} />;
  } else {
    let groupAlbum = match
      ? imageAlbumList.find((album) => album.dir?.match(match))
      : imageAlbumList.find((album) => album.name === name);
    if (!groupAlbum) groupAlbum = { name, list: [] };
    return <GalleryList album={groupAlbum} loading={loading} {...setArgs} />;
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
  const refList = useRef<RefObject<HTMLDivElement>[]>([]);
  list.forEach((_, index) => {
    refList.current[index] = createRef<HTMLDivElement>();
  });
  return (
    <>
      {list.length > 1 ? (
        <InPageMenu
          list={list.map((item, i) => ({
            name: item.name,
            ref: refList.current[i],
          }))}
          adjust={128}
        />
      ) : isServerMode ? (
        <button
          type="button"
          className="plain fixed z-30 right-0 bottom-0 m-4 cursor-pointer"
          title="アップロードする"
          onClick={() => {
            const uploadElm = document.querySelector(`input[name="upload"]`);
            if (uploadElm) (uploadElm as HTMLInputElement).click();
          }}
        >
          <ArrowUpButton className="fill-main-soft hover:fill-main m-0" />
        </button>
      ) : null}
      {list.map((item, i) => (
        <div key={i} ref={refList.current[i]}>
          <GalleryItem item={item} {...args} />
        </div>
      ))}
    </>
  );
}

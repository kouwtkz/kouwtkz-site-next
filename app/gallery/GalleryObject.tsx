"use client";

import React from "react";
import GalleryList, { GalleryListPropsBase } from "./GalleryList";
import { useMediaImageState } from "@/app/context/MediaImageState";
import { GroupFormat } from "@/imageScripts/MediaImageYamlType";
import { basename } from "path";
import { MediaImageAlbumType } from "@/imageScripts/MediaImageDataType";

export interface GalleryItemObjectType extends GalleryListPropsBase {
  name: string;
  match?: string | RegExp;
  format?: GroupFormat;
}

export type GalleryItemType = string | GalleryItemObjectType;

export type GalleryItemsType = GalleryItemType | GalleryItemType[];

interface GalleryObjectProps extends GalleryListPropsBase {
  items?: GalleryItemsType;
}

export default function GalleryObject({
  items = [],
  ...args
}: GalleryObjectProps) {
  const { imageAlbumList } = useMediaImageState();
  const loading = imageAlbumList.length === 0;
  // if (!items) return <></>;
  const list = Array.isArray(items) ? items : [items];
  // if (imageAlbumList.length === 0) return <></>;
  return (
    <>
      {list.map((item, i) => {
        if (typeof item === "string") item = { name: item };
        const { name, match, format = "image", ..._args } = item;
        const setArgs = { max: 20, filterButton: true, ...args, ..._args };
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
              ...(album.list.find((image) =>
                image.src.startsWith("thumbnail")
              ) || album.list[0]),
            };
            thumbnail.direct = `/gallery/comics?name=${basename(album.name)}`;
            return thumbnail;
          });
          const album: MediaImageAlbumType = { name, list: thumbnails };
          return (
            <GalleryList key={i} album={album} loading={loading} {...setArgs} />
          );
        } else {
          let groupAlbum = match
            ? imageAlbumList.find((album) => album.dir?.match(match))
            : imageAlbumList.find((album) => album.name === name);
          if (!groupAlbum) groupAlbum = { name, list: [] };
          return (
            <GalleryList
              key={i}
              album={groupAlbum}
              loading={loading}
              {...setArgs}
            />
          );
        }
      })}
    </>
  );
}

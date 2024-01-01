"use client";

import React from "react";
import GalleryList, { GalleryListPropsBase } from "./GalleryList";
import { useMediaImageState } from "@/app/context/MediaImageState";
import { GroupFormat } from "@/imageScripts/MediaImageYamlType";
import { basename } from "path";
import { MediaImageAlbumType } from "@/imageScripts/MediaImageDataType";

interface GalleryPageListType extends GalleryListPropsBase {
  name: string;
  label?: string;
  match?: string | RegExp;
  format?: GroupFormat;
}

interface GalleryPageProps extends GalleryListPropsBase {
  items: string | GalleryPageListType | Array<string | GalleryPageListType>;
}

export default function GalleryPage({ items, ...args }: GalleryPageProps) {
  const list = Array.isArray(items) ? items : [items];
  const { imageAlbumList } = useMediaImageState();
  if (imageAlbumList.length === 0) return <></>;
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
          return <GalleryList key={i} album={album} {...setArgs} />;
        } else {
          const groupAlbum =
            (match
              ? imageAlbumList.find((album) => album.dir?.match(match))
              : imageAlbumList.find((album) => album.name === name)) || null;
          return <GalleryList key={i} album={groupAlbum} {...setArgs} />;
        }
      })}
    </>
  );
}

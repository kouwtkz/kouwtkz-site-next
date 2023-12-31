"use client";

import React, { Suspense } from "react";
import { useMediaImageState } from "@/app/context/MediaImageState";
import GalleryList from "../GalleryList";
import { basename } from "path";

export default function ComicsList() {
  const { imageAlbumList } = useMediaImageState();
  const comicsAlbums = imageAlbumList.filter((album) => {
    return (
      album.dir &&
      /fanbook/i.test(album.dir) &&
      album.list.some((img) => img.dir?.startsWith("/content"))
    );
  });
  const thumbnails = comicsAlbums.map((album) => {
    const thumbnail = {
      ...(album.list.find((image) => image.src.startsWith("thumbnail")) ||
        album.list[0]),
    };
    thumbnail.direct = `/gallery/comics?name=${basename(album.name)}`;
    return thumbnail;
  });
  return <GalleryList album={{ name: "fanbook", list: thumbnails }} max={20} />;
}

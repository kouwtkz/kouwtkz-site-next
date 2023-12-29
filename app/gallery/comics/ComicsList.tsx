"use client";

import React, { Suspense } from "react";
import { useMediaImageState } from "@/app/context/MediaImageState";
import GalleryList from "../GalleryList";

export default function ComicsList() {
  const { imageAlbumList } = useMediaImageState();
  const comicsAlbums = imageAlbumList.filter((album) =>
    album.group?.match(/fanbook/i)
  );
  const thumbnails = comicsAlbums.map((album) => {
    const thumbnail = {
      ...(album.list.find((image) =>
        image.tags?.some((tag) => tag === "thumbnail")
      ) || album.list[0]),
    };
    thumbnail.direct = `/gallery/comics?name=${album.name}`;
    return thumbnail;
  });
  return <GalleryList album={{ name: "fanbook", list: thumbnails }} max={20} />
}
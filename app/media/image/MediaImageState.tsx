"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { MediaImageItemType, MediaImageAlbumType } from "./MediaImageData.mjs";
import { useSystemState } from "@/app/components/System/SystemState";

type ImageDataType = {
  imageItemList: Array<MediaImageItemType>;
  imageAlbumList: Array<MediaImageAlbumType>;
  set: boolean;
  setImageAlbum: (albumList: Array<MediaImageAlbumType>) => void;
};
type ImageDataProps = {
  imageAlbums: MediaImageAlbumType[];
};

function parseImageItems(imageAlbums: MediaImageAlbumType[]) {
  const imageList: MediaImageItemType[] = [];
  imageAlbums.forEach((album) => {
    album.list.forEach((item) => {
      item.group = album.name;
      item.time = item.time ? new Date(item.time) : undefined;
      imageList.push(item);
    });
  });
  return imageList;
}

export const useMediaImageState = create<ImageDataType>((set) => ({
  imageItemList: [],
  imageAlbumList: [],
  set: false,
  setImageAlbum: (data) => {
    set(() => ({
      set: true,
      imageAlbumList: data,
      imageItemList: parseImageItems(data),
    }));
  },
}));

const MediaImageState = () => {
  const imageData = useMediaImageState();
  const { date } = useSystemState();
  useEffect(() => {
    fetch(`${location?.origin}/media/image/get?v=${date.getTime()}`)
      .then((d) => d.json())
      .then((json) => {
        if (!imageData.set) imageData.setImageAlbum(json);
      });
  });

  return <></>;
};

export default MediaImageState;

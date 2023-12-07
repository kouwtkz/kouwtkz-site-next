"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { MediaImageItemType, MediaImageAlbumType } from "./MediaImageData.mjs";

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
      imageList.push(item);
    });
  });
  return imageList;
}

export const useDataMediaImage = create<ImageDataType>((set) => ({
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

const MediaImageData = () => {
  const imageData = useDataMediaImage();
  useEffect(() => {
    fetch(`${location?.origin}/api/data/getImageData`)
      .then((d) => d.json())
      .then((json) => {
        if (!imageData.set) imageData.setImageAlbum(json);
      });
  });

  return <></>;
};

export default MediaImageData;

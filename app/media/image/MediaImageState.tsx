"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { MediaImageItemType, MediaImageAlbumType } from "./MediaImageType";
import { useSystemState } from "@/app/components/System/SystemState";
import { DataStateReplacedProps } from "@/app/components/dataState/DataStateFunctions";
import axios from "axios";

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

export default function MediaImageState({ url }: DataStateReplacedProps) {
  const imageData = useMediaImageState();
  useEffect(() => {
    if (!imageData.set)
      axios(url).then((r) => {
        if (!imageData.set) imageData.setImageAlbum(r.data);
      });
  });

  return <></>;
}

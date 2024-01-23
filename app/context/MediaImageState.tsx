"use client";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import {
  MediaImageItemType,
  MediaImageAlbumType,
} from "@/mediaScripts/MediaImageDataType";
import axios from "axios";
const defaultUrl = "/data/images.json";

function parseImageItems(imageAlbums: MediaImageAlbumType[]) {
  const imageList: MediaImageItemType[] = [];
  imageAlbums.forEach((album) => {
    album.list.forEach((item) => {
      album.visible = {
        ...{ info: true, filename: true, title: true },
        ...album.visible,
      };
      item.album = album;
      item.time = item.time ? new Date(item.time) : undefined;
      imageList.push(item);
    });
  });
  return imageList;
}

type ImageDataType = {
  imageItemList: Array<MediaImageItemType>;
  imageAlbumList: Array<MediaImageAlbumType>;
  setImageAlbum: (albumList: Array<MediaImageAlbumType>) => void;
  setImageFromUrl: (url?: string) => void;
};

export const useMediaImageState = create<ImageDataType>((set) => ({
  imageItemList: [],
  imageAlbumList: [],
  setImageAlbum: (data) => {
    set(() => ({
      imageAlbumList: data,
      imageItemList: parseImageItems(data),
    }));
  },
  setImageFromUrl: (url = defaultUrl) => {
    set((state) => {
      axios(url).then((r) => {
        state.setImageAlbum(r.data);
      });
      return state;
    });
  },
}));

export default function MediaImageState({ url }: { url?: string }) {
  const { setImageFromUrl } = useMediaImageState();
  const setImage = useRef(false);
  useEffect(() => {
    if (!setImage.current) setImageFromUrl(url);
    setImage.current = true;
  });

  return <></>;
}

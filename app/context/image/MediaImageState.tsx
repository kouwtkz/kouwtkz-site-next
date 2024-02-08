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

interface ValueCountType {
  value: string;
  count: number;
}

type ImageDataType = {
  imageItemList: Array<MediaImageItemType>;
  imageAlbumList: Array<MediaImageAlbumType>;
  tagList: ValueCountType[];
  copyrightList: ValueCountType[];
  isSet: boolean;
  setImageAlbum: (albumList: Array<MediaImageAlbumType>) => void;
  setImageFromUrl: (url?: string) => void;
};

export const useMediaImageState = create<ImageDataType>((set) => ({
  imageItemList: [],
  imageAlbumList: [],
  tagList: [],
  copyrightList: [],
  isSet: false,
  setImageAlbum: (data) => {
    const imageItemList = parseImageItems(data);
    const tagList = imageItemList
      .reduce((list, c) => {
        c.tags?.forEach((value) => {
          const item = list.find((item) => item.value === value);
          if (item) item.count++;
          else list.push({ value, count: 0 });
        });
        return list;
      }, [] as ValueCountType[])
      .sort((a, b) => (a.value > b.value ? 1 : -1));
    const copyrightList = imageItemList
      .reduce((list, { copyright: value }) => {
        if (value) {
          const item = list.find((item) => item.value === value);
          if (item) item.count++;
          else list.push({ value, count: 0 });
        }
        return list;
      }, [] as ValueCountType[])
      .sort((a, b) => (a.value > b.value ? 1 : -1));
    set(() => ({
      imageAlbumList: data,
      imageItemList,
      tagList,
      copyrightList,
      isSet: true,
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

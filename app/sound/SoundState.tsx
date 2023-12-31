"use client";

import { create } from "zustand";
import { SoundAlbumType, SoundItemType } from "./MediaSoundType";
import { DataStateReplacedProps } from "@/app/components/dataState/DataStateFunctions";
import { useEffect, useRef } from "react";
import axios from "axios";

function parseImageItems(soundAlbums: SoundAlbumType[]) {
  const soundList: SoundItemType[] = [];
  soundAlbums.forEach((album) => {
    album.playlist?.forEach((playlist) => {
      playlist.list.forEach((item) => {
        soundList.push(item);
      });
    });
  });
  return soundList;
}
type SoundDataType = {
  SoundAlbumList: Array<SoundAlbumType>;
  SoundItemList: Array<SoundItemType>;
  setSoundAlbum: (albumList: Array<SoundAlbumType>) => void;
};

export const useSoundState = create<SoundDataType>((set) => ({
  SoundAlbumList: [],
  SoundItemList: [],
  setSoundAlbum: (data) => {
    set(() => ({
      SoundAlbumList: data,
      SoundItemList: parseImageItems(data),
    }));
  },
}));

export default function SoundState({ url }: DataStateReplacedProps) {
  const { setSoundAlbum } = useSoundState();
  const setSound = useRef(false);
  useEffect(() => {
    if (!setSound.current)
      axios(url).then((r) => {
        setSoundAlbum([r.data]);
        setSound.current = true;
      });
  });

  return <></>;
}

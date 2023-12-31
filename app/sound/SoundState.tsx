"use client";

import { create } from "zustand";
import { SoundAlbumType, SoundItemType } from "./MediaSoundType";
import { DataStateReplacedProps } from "@/app/components/dataState/DataStateFunctions";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useSoundPlayer } from "./SoundPlayer";

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
  const { setSrc } = useSoundPlayer();
  const { setSoundAlbum } = useSoundState();
  const setSound = useRef(false);
  useEffect(() => {
    if (!setSound.current)
      axios(url).then((r) => {
        const album = r.data as SoundAlbumType;
        setSoundAlbum([album]);
        const setupSrc = album.playlist?.reduce(
          (a, c) => (a ? a : c.list.find(({ setup }) => setup)?.src || ""),
          ""
        );
        if (setupSrc) setSrc(setupSrc);
        setSound.current = true;
      });
  });

  return <></>;
}

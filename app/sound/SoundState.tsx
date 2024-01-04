"use client";

import { create } from "zustand";
import { SoundAlbumType, SoundItemType } from "./MediaSoundType";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useSoundPlayer } from "./SoundPlayer";

function parseImageItems(soundAlbum: SoundAlbumType) {
  const soundList: SoundItemType[] = [];
  soundAlbum.playlist?.forEach((playlist) => {
    playlist.list.forEach((item) => {
      soundList.push(item);
    });
  });
  return soundList;
}
type SoundDataType = {
  SoundAlbum: SoundAlbumType | null;
  SoundItemList: Array<SoundItemType>;
  setSoundAlbum: (album: SoundAlbumType) => void;
};

export const useSoundState = create<SoundDataType>((set) => ({
  SoundAlbum: null,
  SoundItemList: [],
  setSoundAlbum: (data) => {
    set(() => ({
      SoundAlbum: data,
      SoundItemList: parseImageItems(data),
    }));
  },
}));

export default function SoundState({ url }: { url: string }) {
  const { RegistPlaylist } = useSoundPlayer();
  const { setSoundAlbum } = useSoundState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current)
      axios(url).then((r) => {
        const album = r.data as SoundAlbumType;
        setSoundAlbum(album);
        const setupPlaylist = album.playlist?.find((playlist) =>
          playlist.list.some((item) => item.setup)
        ) || { list: [] };
        const setupSoundIndex = setupPlaylist?.list.findIndex(
          (item) => item.setup
        );
        if (setupPlaylist?.list.length > 0)
          RegistPlaylist({ playlist: setupPlaylist, current: setupSoundIndex });
      });
    isSet.current = true;
  });

  return <></>;
}

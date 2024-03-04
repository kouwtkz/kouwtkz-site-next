"use client";

import React, { HTMLAttributes, memo, useEffect, useRef } from "react";
import { CharaType, CharaObjectType } from "./CharaType";
import { create } from "zustand";
import axios from "axios";
import { useMediaImageState } from "../context/image/MediaImageState";
import { useSoundState } from "../sound/SoundState";
import GalleryList from "../gallery/GalleryList";
import { PlaylistType, SoundItemType } from "../sound/MediaSoundType";
type CharaStateType = {
  charaList: Array<CharaType>;
  charaObject: CharaObjectType | null;
  isSet: boolean;
  setIsSet: (flag: boolean) => void;
  setCharaObject: (list: CharaObjectType) => void;
};

export const useCharaState = create<CharaStateType>((set) => ({
  charaObject: null,
  charaList: [],
  isSet: false,
  setIsSet: (flag) => set(() => ({ isSet: flag })),
  setCharaObject: (data) => {
    set(() => ({
      charaList: Object.values(data),
      charaObject: data,
      isSet: true,
    }));
  },
}));

export default function CharaState({ url }: { url: string }) {
  const { isSet, setCharaObject } = useCharaState();
  // const isSet = useRef(false);
  const { imageItemList, imageAlbumList } = useMediaImageState();
  const { SoundItemList, defaultPlaylist } = useSoundState();
  useEffect(() => {
    if (!isSet && imageItemList.length > 0 && SoundItemList.length > 0) {
      axios(url).then((r) => {
        const data: CharaObjectType = r.data;
        const charaList = Object.values(data);
        type mediaKindType = "icon" | "image" | "headerImage";
        const mediaKindArray: Array<{ kind: mediaKindType; name?: string }> = [
          { kind: "icon", name: "charaIcon" },
          { kind: "image", name: "charaImages" },
          { kind: "headerImage" },
        ];
        charaList.forEach((chara) => {
          if (!chara.media) chara.media = {};
          const charaMedia = chara.media;
          mediaKindArray.forEach((kindItem) => {
            const charaMediaItem = chara[kindItem.kind];
            if (charaMediaItem) {
              charaMedia[kindItem.kind] = imageItemList.find(({ URL }) =>
                URL?.match(charaMediaItem)
              );
            } else if (kindItem.name) {
              charaMedia[kindItem.kind] = imageItemList.find(
                ({ album, name }) =>
                  album?.name === kindItem.name && name === chara.id
              );
            }
          });
          if (typeof chara.time === "string") chara.time = new Date(chara.time);
          let playlist = chara.playlist;
          if (playlist) {
            const playlistTitle = `${chara.name}のプレイリスト`;
            chara.media.playlist = {
              title: playlistTitle,
              list: playlist
                .reduce((a, c) => {
                  if (c === "default") {
                    defaultPlaylist?.list.forEach(({ src }) => {
                      const foundIndex = SoundItemList.findIndex(
                        (item) => item.src === src
                      );
                      if (foundIndex >= 0) a.push(foundIndex);
                    });
                  } else {
                    const foundIndex = SoundItemList.findIndex((item) =>
                      item.src.endsWith(c)
                    );
                    if (foundIndex >= 0) a.push(foundIndex);
                  }
                  return a;
                }, [] as number[])
                .filter((i) => i >= 0)
                .map((i) => SoundItemList[i]),
            };
          }
        });
        setCharaObject(data);
      });
    }
  });

  return <></>;
}

export interface CharaGalleryAlbumProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  chara: CharaType;
  label?: string;
  max?: number;
}

export function CharaGalleryAlbum({
  name,
  label,
  chara,
  max = 20,
  ...args
}: CharaGalleryAlbumProps) {
  const { imageAlbumList } = useMediaImageState();
  if (!name || imageAlbumList.length === 0) return <></>;
  const matchAlbum = imageAlbumList.find((album) => album.name === name);
  if (!matchAlbum) return <></>;
  const album = {
    ...matchAlbum,
    list: matchAlbum.list.filter((item) =>
      item.tags?.some((v) => v === chara.id)
    ),
  };
  if (album.list.length === 0) return <></>;
  return (
    <GalleryList
      album={album}
      label={label}
      tags={chara.id}
      autoDisable={true}
      max={max}
      filterButton={true}
      {...args}
    />
  );
}

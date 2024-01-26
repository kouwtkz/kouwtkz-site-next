"use client";

import React, { HTMLAttributes, memo, useEffect, useRef } from "react";
import { CharaType, CharaObjectType } from "./CharaType";
import { create } from "zustand";
import axios from "axios";
import { useMediaImageState } from "../context/MediaImageState";
import { useSoundState } from "../sound/SoundState";
import GalleryList from "../gallery/GalleryList";
type CharaStateType = {
  charaList: Array<CharaType>;
  charaObject: CharaObjectType | null;
  setCharaObject: (list: CharaObjectType) => void;
};

export const useCharaState = create<CharaStateType>((set) => ({
  charaObject: null,
  charaList: [],
  set: false,
  setCharaObject: (data) => {
    set(() => ({
      charaList: Object.values(data),
      charaObject: data,
    }));
  },
}));

export default function CharaState({ url }: { url: string }) {
  const charaData = useCharaState();
  const isSet = useRef(false);
  const { imageItemList, imageAlbumList } = useMediaImageState();
  const { SoundItemList, defaultPlaylist } = useSoundState();
  useEffect(() => {
    if (
      !isSet.current &&
      imageItemList.length > 0 &&
      SoundItemList.length > 0
    ) {
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
          let playlist: unknown = chara.playlist;
          const playlistTitle = `${chara.name}のプレイリスト`;
          if (typeof playlist === "string") {
            if (playlist === "default") {
              if (defaultPlaylist)
                chara.playlist = {
                  ...defaultPlaylist,
                  title: playlistTitle,
                };
            } else playlist = [playlist];
          }
          if (Array.isArray(playlist)) {
            chara.playlist = {
              title: playlistTitle,
              list: playlist
                .map((src) =>
                  SoundItemList.findIndex((item) => item.src.endsWith(src))
                )
                .filter((i) => i >= 0)
                .map((i) => SoundItemList[i]),
            };
          }
        });
        charaData.setCharaObject(data);
      });
      isSet.current = true;
    }
  });

  return <></>;
}

interface CharaGalleryAlbumProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  chara: CharaType;
  label?: string;
  max?: number;
}

export const CharaGalleryAlbum = memo(function GalleryFromAlbum({
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
});

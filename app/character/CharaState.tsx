"use client";

import React, { useEffect, useRef } from "react";
import { CharaType, CharaObjectType } from "./CharaType";
import { create } from "zustand";
import axios from "axios";
import { useMediaImageState } from "../context/MediaImageState";
import { useSoundState } from "../sound/SoundState";
import HTMLReactParser from "html-react-parser";
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

const CharaState = ({ url }: { url: string }) => {
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
};

export default CharaState;

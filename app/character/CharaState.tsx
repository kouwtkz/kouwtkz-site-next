"use client";
import { CharaType, CharaObjectType } from "./chara";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { useMediaImageState } from "../context/MediaImageState";
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
  useEffect(() => {
    if (!isSet.current && imageItemList.length > 0) {
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
        });
        charaData.setCharaObject(data);
      });
      isSet.current = true;
    }
  });

  return <></>;
};

export default CharaState;

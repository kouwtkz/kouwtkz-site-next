"use client";
import { CharaType, CharaObjectType } from "./chara.d";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import { useSystemState } from "../components/System/SystemState";
import axios from "axios";
import { useMediaImageState } from "../context/MediaImageState";
import { MediaImageAlbumType } from "@/imageScripts/MediaImageType";
type CharaDataType = {
  charaList: Array<CharaType>;
  charaObject: CharaObjectType | null;
  setCharaObject: (list: CharaObjectType) => void;
};
type CharaDataProps = {
  charaObject: CharaObjectType;
};

export const useCharaData = create<CharaDataType>((set) => ({
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

const CharaData = () => {
  const charaData = useCharaData();
  const { date } = useSystemState();
  const setChara = useRef(false);
  const { imageItemList, imageAlbumList } = useMediaImageState();
  useEffect(() => {
    if (!setChara.current && imageItemList.length > 0) {
      const url = `/data/characters.json?v=${date.getTime()}`;
      axios(url).then((r) => {
        const data: CharaObjectType = r.data;
        const charaList = Object.values(data);
        type mediaKindType = "icon" | "image" | "headerImage";
        const mediaKindArray: Array<{ kind: mediaKindType; name?: string }> = [
          { kind: "icon", name: "charaIcon" },
          { kind: "image", name: "charaImages" },
          { kind: "headerImage" },
        ];
        const albumCharaMediaKinds = mediaKindArray.reduce((c, kindItem) => {
          const mediaName = kindItem.name || kindItem.kind;
          const obj = imageAlbumList.find((album) => album.name === mediaName);
          if (obj) c[kindItem.kind] = obj;
          return c;
        }, {} as { [key: string]: MediaImageAlbumType | undefined });
        charaList.forEach((chara) => {
          if (!chara.media) chara.media = {};
          const media = chara.media;
          mediaKindArray.forEach((kindItem) => {
            if (
              typeof chara[kindItem.kind] === "string" &&
              chara[kindItem.kind] !== ""
            ) {
              const mediaPath = `.*${chara[kindItem.kind]}.*`;
              media[kindItem.kind] = imageItemList.find((item) =>
                item.path?.match(mediaPath)
              );
            } else {
              media[kindItem.kind] = albumCharaMediaKinds[
                kindItem.kind
              ]?.list.find((item) => item.name === chara.id);
            }
          });
        });
        console.log(charaList);
        charaData.setCharaObject(data);

        setChara.current = true;
      });
    }
  });

  return <></>;
};

export default CharaData;

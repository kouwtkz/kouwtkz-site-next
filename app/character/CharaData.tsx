"use client";
import { CharaType, CharaObjectType } from "./chara.d";

import React, { useEffect } from "react";
import { create } from "zustand";
import { useSystemState } from "../components/System/SystemState";
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
  setCharaObject: (data) => {
    set(() => ({ charaList: Object.values(data), charaObject: data }));
  },
}));

const CharaData = () => {
  const charaData = useCharaData();
  const { date } = useSystemState();
  useEffect(() => {
    fetch(`${location?.origin}/character/data?v=${date.getTime()}`)
      .then((d) => d.json())
      .then((json) => {
        if (!charaData.charaObject) charaData.setCharaObject(json);
      });
  });

  return <></>;
};

export default CharaData;

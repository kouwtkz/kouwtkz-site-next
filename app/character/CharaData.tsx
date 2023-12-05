"use client";
import { CharaType, CharaObjectType } from "./chara.d";

import React from "react";
import { create } from "zustand";
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
    set(() => (
      { charaList: Object.values(data), charaObject: data }
    ));
  },
}));

const CharaData = ({ charaObject }: CharaDataProps) => {
  const charaData = useCharaData();
  if (!charaData.charaObject) charaData.setCharaObject(charaObject);
  return <></>;
};

export default CharaData;

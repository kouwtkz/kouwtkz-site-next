"use client";
import { CharaType, CharaObjectType } from "./chara.d";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import { useSystemState } from "../components/System/SystemState";
import axios from "axios";
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
  useEffect(() => {
    if (!setChara.current) {
      const url = `/data/characters.json?v=${date.getTime()}`;
      axios(url).then((r) => {
        charaData.setCharaObject(r.data);
        setChara.current = true;
      });
    }
  });

  return <></>;
};

export default CharaData;

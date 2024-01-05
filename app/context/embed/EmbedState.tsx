"use client";
import React, { ReactNode, useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";

export type EmbedTextType = string | string[];
export type EmbedDataType = { [k: string]: string } | null;

type EmbedStateType = {
  data: EmbedDataType;
  setData: (value: any) => void;
};

export const useEmbedState = create<EmbedStateType>((set) => ({
  data: null,
  setData: (value) => {
    set({ data: value });
  },
}));

export default function EmbedState({ url }: { url: string }) {
  const isSet = useRef(false);
  const { setData: setList } = useEmbedState();
  useEffect(() => {
    if (!isSet.current) {
      axios(url)
        .then((r) => {
          setList(r.data);
        })
        .catch(() => {
          setList({});
        });
      isSet.current = true;
    }
  });
  return <></>;
}

"use client";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { reducedGitItemType } from "./gitType";
const defaultUrl = "/data/gitlog.json";

type GitStateType = {
  log: reducedGitItemType[];
  isSet: boolean;
  url: string;
  setLog: (value: reducedGitItemType[]) => void;
  setUrl: (url?: string, setFlag?: boolean) => void;
  setLogFromUrl: (url?: string) => void;
  isSetCheck: () => void;
};

export const useGitState = create<GitStateType>((set) => ({
  log: [],
  isSet: false,
  url: defaultUrl,
  setLog: (value) => {
    set({ log: value, isSet: true });
  },
  setUrl(url = defaultUrl, setFlag = true) {
    if (setFlag) {
      set((state) => {
        state.setLogFromUrl(url);
        return state;
      });
    } else {
      set(() => {
        return { url };
      });
    }
  },
  setLogFromUrl(url?: string) {
    set((state) => {
      axios(url || state.url).then((r) => {
        const data: reducedGitItemType[] = r.data;
        state.setLog(data);
      });
      return url ? { url } : state;
    });
  },
  isSetCheck() {
    set((state) => {
      if (!state.isSet) state.setLogFromUrl();
      return state;
    });
  },
}));

export default function GitState({
  url,
  setFlag,
}: {
  url: string;
  setFlag?: boolean;
}) {
  const { setUrl } = useGitState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      setUrl(url, setFlag);
      isSet.current = true;
    }
  });
  return <></>;
}

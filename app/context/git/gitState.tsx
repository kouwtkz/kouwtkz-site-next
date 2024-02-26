"use client";
import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { reducedGitItemType } from "./gitType";

type GitStateType = {
  log: reducedGitItemType[];
  setLog: (value: reducedGitItemType[]) => void;
  isSet: boolean;
};

export const useGitState = create<GitStateType>((set) => ({
  log: [],
  setLog: (value) => {
    set({ log: value, isSet: true });
  },
  isSet: false,
}));

export default function GitState({ url }: { url: string }) {
  const { log, setLog } = useGitState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      axios(url).then((r) => {
        const data: reducedGitItemType[] = r.data;
        setLog(data);
      });
      isSet.current = true;
    }
  });
  return <></>;
}

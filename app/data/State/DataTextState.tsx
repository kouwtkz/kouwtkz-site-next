"use client";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";

type DataTextStateType = {
  values: { [key: string]: string | boolean | number | object } | null;
  set: (value: string) => void;
};

export const useDataTextState = create<DataTextStateType>((set) => ({
  values: null,
  set: (value) => {
    const values = Object.fromEntries(
      value.split("\n").map((v) => {
        const pos = v.indexOf("=");
        let [key, value] =
          pos >= 0 ? [v.slice(0, pos), v.slice(pos + 1)] : [v, true];
        if (typeof value === "string") {
          if (/^(true|false)$/.test(value)) return [key, value === "true"];
          if (/^-?[\d.]+$/.test(value)) return [key, Number(value)];
          else if (/^{.*}$|^\[.*\]$/.test(value))
            return [key, JSON.parse(value)];
        }
        return [key, value];
      })
    );
    set({ values });
  },
}));

export default function DataTextState({ url }: { url: string }) {
  const { set } = useDataTextState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      axios(url).then((r) => {
        set(r.data);
      });
      isSet.current = true;
    }
  });
  return <></>;
}

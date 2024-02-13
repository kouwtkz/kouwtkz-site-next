"use client";

import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { useCookies } from "react-cookie";

type DataTextStateType = {
  values: { [key: string]: string | boolean | number | object } | null;
  dataSet: (value: string) => void;
};

export const useDataTextState = create<DataTextStateType>((set) => ({
  values: null,
  dataSet: (value) => {
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
  const { dataSet } = useDataTextState();
  const isSet = useRef(false);
  const [cookies] = useCookies(["theme"]);
  useEffect(() => {
    if (!isSet.current) {
      axios(url).then((r) => {
        dataSet(r.data);
      });
      if (cookies.theme) document?.documentElement.classList.add(cookies.theme);
      isSet.current = true;
    }
  });
  return <></>;
}

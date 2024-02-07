"use client";
import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { SiteDataType } from "./SiteDataType";

type SiteStateType = {
  site: SiteDataType | null;
  setSite: (value: SiteDataType) => void;
  isSet: boolean;
};

export const useSiteState = create<SiteStateType>((set) => ({
  site: null,
  setSite: (value) => {
    set({ site: value, isSet: true });
  },
  isSet: false,
}));

export default function SiteState({ url }: { url: string }) {
  const { site, setSite } = useSiteState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      axios(url).then((r) => {
        const data: SiteDataType = r.data;
        setSite(data);
      });
      isSet.current = true;
    }
  });
  return <></>;
}

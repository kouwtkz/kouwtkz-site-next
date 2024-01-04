"use client";
import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import { SiteProps } from "./SiteDataType";

type SiteStateType = {
  site: SiteProps | null;
  setSite: (value: SiteProps) => void;
};

export const useSiteState = create<SiteStateType>((set) => ({
  site: null,
  setSite: (value) => {
    set({ site: value });
  },
}));

export default function SiteState({ url }: { url: string }) {
  const { site, setSite } = useSiteState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      axios(url).then((r) => {
        const data: SiteProps = r.data;
        setSite(data);
      });
      isSet.current = true;
    }
  });
  return <></>;
}

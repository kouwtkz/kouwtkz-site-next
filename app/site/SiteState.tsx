"use client";
import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import { useSystemState } from "../components/System/SystemState";
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

export default function SiteState() {
  const { date } = useSystemState();
  const { site, setSite } = useSiteState();
  const isSetSite = useRef(false);
  useEffect(() => {
    if (!isSetSite.current && !site) {
      const url = `/data/site.json?v=${date.getTime()}`;
      axios(url).then((r) => {
        const data: SiteProps = r.data;
        setSite(data);
      });
    }
  });
  return <></>;
}

"use client";
import React, { HTMLAttributes, memo, useEffect, useRef } from "react";
import { create } from "zustand";
import axios from "axios";
import HTMLReactParser from "html-react-parser";

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

interface EmbedNodeProps extends HTMLAttributes<HTMLDivElement> {
  embed?: string[] | string;
}

export const EmbedNode = memo(function EmbedNode({
  embed,
  ...args
}: EmbedNodeProps) {
  const { data: embedData } = useEmbedState();
  if (!embed || embedData === null) return <></>;
  const list = typeof embed === "string" ? [embed] : embed;
  return (
    <>
      {list.map((name, i) => (
        <div key={i} {...args}>
          {HTMLReactParser(embedData[name] || name)}
        </div>
      ))}
    </>
  );
});

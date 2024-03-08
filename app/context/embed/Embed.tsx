"use client";
import React, {
  HTMLAttributes,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { create } from "zustand";
import axios from "axios";
import HTMLReactParser from "html-react-parser";

type EmbedStateType = {
  list: string[];
  isSet: boolean;
  setList: (value: any) => void;
};

export const useEmbedState = create<EmbedStateType>((set) => ({
  list: [],
  isSet: false,
  setList: (value) => {
    set({ list: value, isSet: true });
  },
}));

export function EmbedState() {
  const isSet = useRef(false);
  const { setList } = useEmbedState();
  useEffect(() => {
    if (!isSet.current) {
      axios("/context/embed")
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
  embed?: string;
}

export function getEmbedURL(item: string) {
  return item.includes("://") || item.startsWith("/") ? item : `/embed/${item}`;
}

export const EmbedNode = memo(function EmbedNode({
  embed,
  ...args
}: EmbedNodeProps) {
  const [element, setElement] = useState<string>();
  useEffect(() => {
    if (embed) {
      if (embed.includes("</")) {
        setElement(embed);
      } else {
        const url = getEmbedURL(embed);
        axios(url).then(({ data }) => {
          setElement(data);
        });
      }
    }
  }, [embed]);
  return element ? <div {...args}>{HTMLReactParser(element)}</div> : <></>;
});

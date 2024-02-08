/* eslint-disable @next/next/no-img-element */
"use client";

import CharaState, { useCharaState } from "@/app/character/CharaState";
import MediaImageState, {
  useMediaImageState,
} from "@/app/context/image/MediaImageState";
import SiteState, { useSiteState } from "@/app/context/site/SiteState";
import PostState, { usePostState } from "@/app/blog/PostState";
import SoundState, { useSoundState } from "@/app/sound/SoundState";
import DataTextState, { useDataTextState } from "./DataTextState";
import EmbedState, { useEmbedState } from "../embed/EmbedState";
import MarkdownDataState, {
  useMarkdownDataState,
} from "../md/MarkdownDataState";
import { create } from "zustand";
import { useLayoutEffect, useRef } from "react";

function addMdate(url: string, values: { [k: string]: any }) {
  if (values[url]) return `${url}?v=${values[url]}`;
  else return url;
}

type DataStateType = {
  complete: boolean;
  setComplete: (value: boolean) => void;
};

export const useDataState = create<DataStateType>((set) => ({
  complete: false,
  setComplete: (value) => {
    set(() => ({ complete: value }));
  },
}));

function State() {
  const { values } = useDataTextState();
  return (
    <>
      <DataTextState url={"/data/update.txt"} />
      {values ? (
        <>
          <CharaState url={addMdate("/data/characters.json", values)} />
          <SiteState url={addMdate("/data/site.json", values)} />
          <MarkdownDataState url={addMdate("/data/md.json", values)} />
          <MediaImageState url={addMdate("/data/images.json", values)} />
          <SoundState url={addMdate("/data/sound.json", values)} />
          <PostState url={addMdate("/blog/posts.json", values)} />
          <EmbedState url={addMdate("/data/embed.json", values)} />
        </>
      ) : null}
    </>
  );
}

export default function DataState() {
  const stateList = [
    useCharaState(),
    useSiteState(),
    useMarkdownDataState(),
    useMediaImageState(),
    useSoundState(),
    usePostState(),
    useEmbedState(),
  ];
  const { complete, setComplete } = useDataState();
  const first = useRef(true);
  const loading = useRef(true);
  useLayoutEffect(() => {
    const doSetComplete = () => {
      if (!complete) {
        const comp = stateList.every((v) => v.isSet);
        if (comp) setComplete(true);
      }
    };
    doSetComplete();
    if (first.current) {
      setTimeout(() => {
        if (!complete) setComplete(true);
      }, 3000);
      first.current = false;
    }
  });
  useLayoutEffect(() => {
    if (loading.current && complete) {
      document.body.classList.remove("loading");
      loading.current = false;
    }
  });
  return (
    <>
      {complete ? null : (
        <>
          <div
            className={
              "fixed top-0 w-[100vw] h-[100vh] bg-background-top z-[100] " +
              "flex flex-col items-center justify-center"
            }
          >
            <span className="text-main text-2xl font-mono">
              よみこみちゅう…
            </span>
            <img
              className="my-4"
              src="/images/gif/watakaze_icon_background.gif"
              alt="読み込み中の画像"
            />
            <noscript className="text-center font-sans">
              <p>Javascriptが無効のようです</p>
              <p>有効にすることで見れるようになります🐏</p>
            </noscript>
          </div>
        </>
      )}
      <State />
    </>
  );
}

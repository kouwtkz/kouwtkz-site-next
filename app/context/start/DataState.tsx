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
import GitState from "../git/gitState";
const loadingCheckID = "Element_DateState_Loading_NotEnd";
const reloadFunction =
  process.env.NODE_ENV === "development"
    ? `setTimeout(() => {if (document.getElementById("${loadingCheckID}")) location.reload()}, 5000)`
    : "";

function addMdate(url: string, values: { [k: string]: any }) {
  if (values[url]) return `${url}?v=${values[url]}`;
  else return url;
}

type DataStateType = {
  isComplete: boolean;
  setComplete: (value: boolean) => void;
};

export const useDataState = create<DataStateType>((set) => ({
  isComplete: false,
  setComplete: (value) => {
    set(() => ({ isComplete: value }));
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
          <GitState url={addMdate("/data/gitlog.json", values)} />
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
  const { isComplete, setComplete } = useDataState();
  const first = useRef(true);
  const loading = useRef(true);
  const doSetComplete = () => {
    if (!isComplete) {
      const comp = stateList.every((v) => v.isSet);
      if (comp) setComplete(true);
    }
  };
  useLayoutEffect(() => {
    doSetComplete();
    if (first.current) {
      setTimeout(() => {
        if (!isComplete) setComplete(true);
      }, 5000);
      first.current = false;
    }
  });
  useLayoutEffect(() => {
    if (loading.current && isComplete) {
      document.body.classList.remove("loading");
      loading.current = false;
    }
  });
  return (
    <>
      {isComplete ? null : (
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
            {first.current && reloadFunction ? (
              <>
                <script dangerouslySetInnerHTML={{ __html: reloadFunction }} />
                <div id={loadingCheckID} />
              </>
            ) : null}
          </div>
        </>
      )}
      <State />
    </>
  );
}

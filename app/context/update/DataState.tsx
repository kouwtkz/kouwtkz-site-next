/* eslint-disable @next/next/no-img-element */
"use client";

import CharaState, { useCharaState } from "@/app/character/CharaState";
import MediaImageState, {
  useMediaImageState,
} from "@/app/context/MediaImageState";
import SiteState, { useSiteState } from "@/app/context/site/SiteState";
import PostState, { usePostState } from "@/app/blog/PostState";
import SoundState, { useSoundState } from "@/app/sound/SoundState";
import DataTextState, { useDataTextState } from "./DataTextState";
import EmbedState, { useEmbedState } from "../embed/EmbedState";
import MarkdownDataState, {
  useMarkdownDataState,
} from "../md/MarkdownDataState";
import { create } from "zustand";
import { useEffect, useRef } from "react";
import { SiteTitle } from "@/app/components/navigation/header";

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

interface DataStateProps {
  title: string;
}

export default function DataState({ title }: DataStateProps) {
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
  useEffect(() => {
    const doSetComplete = () => {
      if (!complete) {
        const comp = stateList.every((v) => v.isSet);
        if (comp) setComplete(true);
      }
    };
    doSetComplete();
    if (first.current) {
      setTimeout(doSetComplete, 3000);
      first.current = false;
    }
  });
  return (
    <>
      {complete ? (
        <></>
      ) : (
        <div
          className={
            "fixed w-[100vw] h-[100vh] bg-background-top z-[100] " +
            "flex flex-col items-center justify-center"
          }
        >
          <div className="text-center my-4">
            <SiteTitle title={title} />
          </div>
          <span className="text-main text-2xl font-KosugiMaru">
            よみこみちゅう…
          </span>
          <img
            className="my-4"
            src="/images/gif/watakaze_icon_background.gif"
            alt="読み込み中の画像"
          />
        </div>
      )}
      <State />
    </>
  );
}

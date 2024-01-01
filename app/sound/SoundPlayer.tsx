"use client";

import { Suspense, useRef } from "react";
import { create } from "zustand";
import SoundFixed from "./SoundFixed";
import { LoopMode, PlaylistType, SoundItemType } from "./MediaSoundType";
import { parse } from "path";
const LoopModeList: LoopMode[] = ["loop", "loopOne", "playUntilEnd", "off"];

type PlaylistSrcType =
  | string
  | string[]
  | SoundItemType
  | SoundItemType[]
  | PlaylistType;

type SoundPlayerType = {
  paused: boolean;
  ended: boolean;
  playlist: PlaylistType;
  current: number;
  loopMode: LoopMode;
  SetPaused: (paused: boolean) => void;
  SetEnded: (ended: boolean) => void;
  SetPlaylist: (playlist: PlaylistSrcType, current?: number) => void;
  SetCurrent: (current: number) => void;
  SetLoopMode: (loopMode: LoopMode) => void;
  Play: (playlist?: PlaylistSrcType, current?: number) => void;
  Pause: () => void;
  Stop: () => void;
  Next: () => void;
  Prev: () => void;
  NextLoopMode: () => void;
};

export const useSoundPlayer = create<SoundPlayerType>((set) => ({
  paused: true,
  ended: true,
  playlist: { list: [] },
  current: 0,
  loopMode: LoopModeList[0],
  SetPaused: (paused) => {
    set(() => ({ paused }));
  },
  SetEnded: (ended) => {
    set(() => ({ ended }));
  },
  SetPlaylist: (playlist, current = 0) => {
    if (Array.isArray(playlist)) {
      playlist = {
        list: playlist.map((item) =>
          typeof item === "string"
            ? { src: item, title: parse(item).base }
            : item
        ),
      };
    } else {
      if (typeof playlist === "string")
        playlist = { list: [{ src: playlist, title: parse(playlist).base }] };
      if (typeof playlist.list === "undefined") playlist = { list: [playlist] };
    }
    set(() => ({
      playlist: typeof src === "string" ? [src] : src,
      current,
    }));
  },
  SetCurrent: (current) => {
    set(() => ({ current }));
  },
  SetLoopMode: (loopMode) => {
    set(() => ({ loopMode }));
  },
  Play: (src, current) => {
    set((state) => {
      if (src) state.SetPlaylist(src, current);
      return { paused: false };
    });
  },
  Pause: () => {
    set(() => ({ paused: true, ended: false }));
  },
  Stop: () => {
    set(() => ({ paused: true, ended: true, current: 0 }));
  },
  Next: () => {
    set((state) => {
      if (
        state.loopMode === "playUntilEnd" &&
        state.playlist.length === state.current + 1
      ) {
        return { paused: true, ended: true };
      } else return { current: (state.current + 1) % state.playlist.length };
    });
  },
  Prev: () => {
    set((state) => {
      if (state.loopMode === "playUntilEnd" && state.current === 0) {
        return { current: state.current === 0 ? 0 : state.current - 1 };
      } else {
        const length = state.playlist.length;
        return { current: (length + state.current - 1) % length };
      }
    });
  },
  NextLoopMode: () => {
    set((state) => ({
      loopMode:
        LoopModeList[
          (LoopModeList.indexOf(state.loopMode) + 1) % LoopModeList.length
        ],
    }));
  },
}));

function Main() {
  const refAudio = useRef<HTMLAudioElement>(null);
  const audioElm = refAudio.current;
  const { paused, ended, Stop, playlist, current, loopMode, Next } =
    useSoundPlayer();
  const src = playlist[current] || "";
  if (audioElm) {
    if (src && !audioElm.src.endsWith(src)) audioElm.src = src;
    if (audioElm.paused !== paused) {
      if (paused) {
        audioElm.pause();
      } else {
        if (ended) audioElm.currentTime = 0;
        audioElm.play();
      }
    }
  }
  const html = typeof window === "object" ? document?.documentElement : null;
  if (paused) {
    html?.classList.remove("audio_play");
  } else {
    html?.classList.add("audio_play");
  }
  return (
    <>
      <SoundFixed />
      <audio
        ref={refAudio}
        onEnded={() => {
          switch (loopMode) {
            case "loop":
            case "playUntilEnd":
              Next();
              break;
            case "loopOne":
              if (audioElm) {
                audioElm.currentTime = 0;
                audioElm.play();
              }
              break;
            case "off":
              Stop();
              break;
          }
        }}
      />
    </>
  );
}

export default function SoundPlayer() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

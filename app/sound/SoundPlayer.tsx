"use client";

import { Suspense, useRef } from "react";
import { create } from "zustand";
import SoundFixed from "./SoundFixed";
import { LoopMode } from "./MediaSoundType";
const LoopModeList: LoopMode[] = ["loop", "loopOne", "playUntilEnd", "off"];

type SoundPlayerType = {
  paused: boolean;
  ended: boolean;
  playlist: string[];
  current: number;
  loopMode: LoopMode;
  SetPaused: (paused: boolean) => void;
  SetEnded: (ended: boolean) => void;
  SetPlaylist: (src: string | string[], current?: number) => void;
  SetCurrent: (current: number) => void;
  SetLoopMode: (loopMode: LoopMode) => void;
  Play: (src?: string | string[], current?: number) => void;
  Pause: () => void;
  Stop: () => void;
  Next: () => void;
  Prev: () => void;
  NextLoopMode: () => void;
};

export const useSoundPlayer = create<SoundPlayerType>((set) => ({
  paused: true,
  ended: true,
  playlist: [],
  current: 0,
  loopMode: LoopModeList[0],
  SetPaused: (paused) => {
    set(() => ({ paused }));
  },
  SetEnded: (ended) => {
    set(() => ({ ended }));
  },
  SetPlaylist: (src, current = 0) => {
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

"use client";

import { Suspense, useRef } from "react";
import { create } from "zustand";
import SoundFixed from "./SoundFixed";
import { LoopMode, PlaylistType, SoundItemType } from "./MediaSoundType";
import { parse } from "path";
const LoopModeList: LoopMode[] = ["loop", "loopOne", "playUntilEnd", "off"];

type PlaylistRegistType =
  | string
  | string[]
  | SoundItemType
  | SoundItemType[]
  | PlaylistType;
export type PlaylistRegistProps = {
  playlist?: PlaylistRegistType;
  current?: number;
};

type SoundPlayerType = {
  paused: boolean;
  ended: boolean;
  playlist: PlaylistType;
  current: number;
  loopMode: LoopMode;
  SetPaused: (paused: boolean) => void;
  SetEnded: (ended: boolean) => void;
  RegistPlaylist: (args: PlaylistRegistProps) => void;
  SetCurrent: (current: number) => void;
  SetLoopMode: (loopMode: LoopMode, current?: number) => void;
  Play: (args?: PlaylistRegistProps) => void;
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
  RegistPlaylist: ({ playlist: _playlist, current = 0 }) => {
    let playlist: PlaylistType;
    if (Array.isArray(_playlist)) {
      playlist = {
        list: _playlist.map((item) =>
          typeof item === "string"
            ? { src: item, title: parse(item).base }
            : item
        ),
      };
    } else {
      if (typeof _playlist === "string")
        playlist = { list: [{ src: _playlist, title: parse(_playlist).base }] };
      else if (_playlist) {
        if ((_playlist as any).list !== undefined) {
          playlist = _playlist as PlaylistType;
        } else {
          playlist = { list: [_playlist as SoundItemType] };
        }
      } else {
        set(() => ({ current }));
      }
    }
    set(() => {
      return { playlist, current };
    });
  },
  SetCurrent: (current) => {
    set(() => ({ current }));
  },
  SetLoopMode: (loopMode) => {
    set(() => ({ loopMode }));
  },
  Play: ({ playlist, current } = {}) => {
    set((state) => {
      const value: { paused: boolean; current?: number } = { paused: false };
      if (playlist) state.RegistPlaylist({ playlist, current });
      else if (current !== undefined) value.current = current;
      return value;
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
        state.playlist.list.length === state.current + 1
      ) {
        return { paused: true, ended: true };
      } else
        return { current: (state.current + 1) % state.playlist.list.length };
    });
  },
  Prev: () => {
    set((state) => {
      if (state.loopMode === "playUntilEnd" && state.current === 0) {
        return { current: state.current === 0 ? 0 : state.current - 1 };
      } else {
        const length = state.playlist.list.length;
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
  const src = playlist.list[current]?.src || "";
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

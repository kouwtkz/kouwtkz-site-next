"use client";

import { Suspense, useEffect, useRef } from "react";
import { create } from "zustand";

type SoundPlayerType = {
  paused: boolean;
  ended: boolean;
  src: string;
  setPaused: (paused: boolean) => void;
  setEnded: (ended: boolean) => void;
  setSrc: (src: string) => void;
  Play: (src?: string) => void;
  Pause: () => void;
  Stop: () => void;
};

export const useSoundPlayer = create<SoundPlayerType>((set) => ({
  paused: true,
  ended: false,
  src: "",
  setPaused: (paused) => {
    set(() => ({ paused }));
  },
  setEnded: (ended) => {
    set(() => ({ ended }));
  },
  setSrc: (src) => {
    set(() => ({ src }));
  },
  Play: (src) => {
    const value: { paused: boolean; ended: boolean; src?: string } = {
      paused: false,
      ended: false,
    };
    if (src) value.src = src;
    set(() => value);
  },
  Pause: () => {
    set(() => ({ paused: true }));
  },
  Stop: () => {
    set(() => ({ paused: true, ended: true }));
  },
}));

function Main() {
  const refAudio = useRef<HTMLAudioElement>(null);
  const { src, paused, ended, Stop } = useSoundPlayer();
  if (refAudio.current) {
    if (src && !refAudio.current.src.endsWith(src))
      refAudio.current.src = src;
    if (refAudio.current.paused !== paused) {
      if (paused) refAudio.current.pause();
      else refAudio.current.play();
    }
    if (ended) {
      refAudio.current.currentTime = 0;
    }
  }
  const html = typeof window === "object" ? document?.documentElement : null;
  if (paused) {
    html?.classList.remove("audio_play");
  } else {
    html?.classList.add("audio_play");
  }
  return <audio ref={refAudio} onEnded={() => Stop()} />;
}

export default function SoundPlayer() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

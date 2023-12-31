"use client";

import React from "react";
import { useSoundPlayer } from "./SoundPlayer";
import PlayPauseButton from "@/app/components/svg/audio/PlayPauseButton";
import StopButton from "../components/svg/audio/StopButton";

export default function SoundFixed() {
  const { Play, Pause, Stop, paused } = useSoundPlayer();
  return (
    <div className="fixed z-30 left-0 bottom-0 select-none">
      <div className="flex m-2 [&>*]:m-1">
        <PlayPauseButton
          paused={paused}
          className="fill-main-soft cursor-pointer"
          onClick={() => (paused ? Play() : Pause())}
        />
        <StopButton
          className="fill-main-soft cursor-pointer"
          onClick={() => Stop()}
        />
      </div>
    </div>
  );
}

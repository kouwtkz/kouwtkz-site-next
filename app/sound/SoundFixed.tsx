"use client";

import React from "react";
import { useSoundPlayer } from "./SoundPlayer";
import PlayPauseButton from "@/app/components/svg/audio/PlayPauseButton";
import StopButton from "../components/svg/audio/StopButton";
import { usePathname } from "next/navigation";
import LoopButton from "../components/svg/audio/LoopButton";
import PrevButton from "../components/svg/audio/PrevButton";
import NextButton from "../components/svg/audio/NextButton";
import ShuffleButton from "../components/svg/audio/ShuffleButton";

export default function SoundFixed() {
  const pathname = usePathname();
  const {
    Play,
    Pause,
    Stop,
    Prev,
    Next,
    NextLoopMode,
    ToggleShuffle,
    paused,
    ended,
    loopMode,
    playlist,
    current,
    shuffle,
  } = useSoundPlayer();
  const title = playlist.list[current]?.title || null;
  return (
    <>
      {/sound/.test(pathname) || !paused || !ended ? (
        <div className="fixed z-30 left-0 bottom-0 select-none">
          <div className="flex flex-col [&>*]:flex m-2">
            <div className="[&>*]:m-1 [&>*]:fill-main-soft [&>*]:cursor-pointer">
              <StopButton
                className="hover:fill-main-pale"
                onClick={() => Stop()}
              />
              <LoopButton
                className="hover:fill-main-pale"
                loopMode={loopMode}
                onClick={() => NextLoopMode()}
              />
              <ShuffleButton
                className="hover:fill-main-pale"
                shuffle={shuffle}
                onClick={() => ToggleShuffle()}
              />
            </div>
            <div className="[&>*]:m-1 [&>*]:fill-main-soft [&>*]:cursor-pointer">
              <PrevButton
                className="hover:fill-main-pale"
                onClick={() => Prev()}
              />
              <PlayPauseButton
                paused={paused}
                className="hover:fill-main-pale"
                onClick={() => (paused ? Play() : Pause())}
              />
              <NextButton
                className="hover:fill-main-pale"
                onClick={() => Next()}
              />
            </div>
            <div className="m-1">
              {title && !(paused && ended) ? "♪ " + title : "（たいきちゅう）"}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

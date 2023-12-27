"use client";
import { SoundAlbumType } from "./MediaSoundData.mjs";
import React, { useEffect } from "react";
import { AudioPlay, AudioStop } from "./SoundPlayer";

type SoundPageProps = {
  soundAlbum: SoundAlbumType | null;
};

export default function SoundPage({ soundAlbum }: SoundPageProps) {
  return (
    <div>
      <div className="">
        <h1 className="font-LuloClean text-4xl text-main pt-8 mb-8">
          SOUND ROOM
        </h1>
        <div onClick={() => AudioStop()} className="cursor-pointer text-main">
          停止
        </div>
        {soundAlbum?.playlist?.map((album, i) => (
          <div key={i} className="my-6">
            <h3 className="my-4 text-main-deep">{album.title}</h3>
            {album.list.map((sound, i) => (
              <div key={i} className="my-1">
                <span
                  className="cursor-pointer px-2"
                  onClick={(e) => {
                    AudioPlay(sound.src);
                  }}
                >
                  {sound.title}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

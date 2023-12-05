"use client";
import { SoundAlbumType } from "@/app/media/MediaSoundData.mjs";
import React, { useEffect } from "react";
import { AudioPlay, AudioStop } from "./SoundPlayer";

type SoundPageProps = {
  soundAlbum: SoundAlbumType | null;
};


const SoundPage: React.FC<SoundPageProps> = ({ soundAlbum }) => {
  return (
    <div>
      <div className="">
        <h1 className="font-LuloClean text-4xl text-main pt-8 mb-8">
          SOUND ROOM
        </h1>
        <div onClick={() => AudioStop()} className="cursor-pointer text-main">停止</div>
        {soundAlbum?.playlist?.map((album, i) => (
          <div key={i} className="my-6">
            <h3 className="my-4 text-main-deep">{album.title}</h3>
            {album.list.map((sound, i) => (
              <div
                key={i}
                className="cursor-pointer my-1"
                onClick={(e) => {
                  AudioPlay(sound.src);
                }}
                >
                {sound.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundPage;

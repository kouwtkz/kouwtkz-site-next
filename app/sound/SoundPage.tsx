"use client";

import React, { useRef } from "react";
import PlayPauseButton from "@/app/components/svg/audio/PlayPauseButton";
import { PlaylistRegistProps, useSoundPlayer } from "./SoundPlayer";
import { useSoundState } from "./SoundState";
import TriangleCursor from "../components/svg/cursor/Triangle";
import { PlaylistType } from "./MediaSoundType";
import toast from "react-hot-toast";

export default function SoundPage() {
  const { SoundAlbum, SoundItemList } = useSoundState();
  const {
    Play,
    Pause,
    paused,
    RegistPlaylist,
    playlist: playerList,
    special,
    current,
  } = useSoundPlayer();
  const src = playerList.list[current]?.src || "";
  // const allPlaylistMax = useRef<number>(-1);

  return (
    <div>
      <div className="">
        <h1
          className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8 cursor-pointer"
          onClick={() => {
            if (special) {
              const playlist = SoundAlbum?.playlist?.find((item) =>
                item.list.some((sound) => sound.src === src)
              );
              if (playlist) {
                RegistPlaylist({
                  playlist,
                  current: playlist.list.findIndex(
                    (sound) => sound.src === src
                  ),
                  special: false,
                });
                toast(playlist.title + "を再生", { duration: 1000 });
              }
            } else {
              RegistPlaylist({
                playlist: {
                  title: "すべて再生",
                  list: SoundItemList,
                },
                current: SoundItemList.findIndex((sound) => sound.src === src),
                special: true,
              });
              toast("すべて再生", { duration: 1000 });
            }
          }}
        >
          SOUND ROOM
        </h1>
        {SoundAlbum?.playlist?.map((playlist, i) => {
          return (
            <div key={i} className="my-6">
              <h3 className="my-4 text-main-deep text-3xl">{playlist.title}</h3>
              <div className="flex flex-wrap max-w-4xl mx-auto">
                {playlist.list.map((sound, i) => {
                  const itemPaused = sound.src === src ? paused : true;
                  return (
                    <div
                      key={i}
                      className="my-1 w-[100%] font-bold cursor-pointer md:w-[50%] hover:bg-main-pale-fluo flex items-center"
                      onClick={() => {
                        if (itemPaused) {
                          if (special) {
                            Play({
                              current: SoundItemList.findIndex(
                                (_sound) => _sound.src === sound.src
                              ),
                            });
                          } else {
                            Play({ playlist, current: i });
                          }
                        } else Pause();
                      }}
                    >
                      <div className="flex-1 text-main-soft">
                        {sound.src === src ? (
                          <TriangleCursor
                            className={`mx-auto ${
                              itemPaused ? "fill-main-pale" : "fill-main-soft"
                            }`}
                          />
                        ) : null}
                      </div>
                      <div className="flex-[10] pr-1 text-2xl text-main-dark text-left h-20 align-middle flex items-center">
                        <span>{sound.title}</span>
                      </div>
                      <PlayPauseButton
                        className="flex-[2] mr-1 fill-main-soft"
                        paused={itemPaused}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

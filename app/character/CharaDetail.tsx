"use client";

import { useServerState } from "@/app/components/System/ServerState";
import ImageMee, { ImageMeeIcon } from "@/app/components/image/ImageMee";
import { CharaGalleryAlbum, useCharaState } from "./CharaState";
import { useSoundPlayer } from "@/app/sound/SoundPlayer";
import { memo, useEffect, useRef } from "react";
import { EmbedNode, useEmbedState } from "@/app/context/embed/EmbedState";

type DetailProps = {
  name: string;
};

export default function CharaDetail({ name }: DetailProps) {
  const { isStatic } = useServerState();
  const { charaObject } = useCharaState();
  const { RegistPlaylist, current, playlist } = useSoundPlayer();
  const isSetPlaylist = useRef(false);
  const chara = charaObject ? charaObject[name] : null;
  useEffect(() => {
    if (!isSetPlaylist.current) {
      if (chara?.playlist && playlist.title !== chara.playlist.title) {
        let foundIndex = chara.playlist.list.findIndex(
          (item) => item.src === playlist.list[current].src
        );
        if (foundIndex < 0) foundIndex = 0;
        RegistPlaylist({
          playlist: chara.playlist,
          current: foundIndex,
        });
      }
      isSetPlaylist.current = true;
    }
  });
  if (!chara) return null;

  return (
    <div className="p-0">
      {chara.media?.headerImage ? (
        <div>
          <ImageMee
            imageItem={chara.media.headerImage}
            loading="eager"
            unoptimized={isStatic}
            suppressHydrationWarning={true}
            className="inline-block w-[100%]"
          />
        </div>
      ) : null}
      {chara.media?.image ? (
        <div>
          <ImageMee
            imageItem={chara.media.image}
            mode="thumbnail"
            loading="eager"
            suppressHydrationWarning={true}
            className="inline-block m-4"
            style={{ objectFit: "cover" }}
            height={340}
          />
        </div>
      ) : null}
      <h1 className="text-main-strong font-bold text-3xl h-10 inline-block">
        {chara.media?.icon ? (
          <ImageMeeIcon
            imageItem={chara.media.icon}
            size={40}
            className="charaIcon text-4xl mr-2"
          />
        ) : null}
        <span className="align-middle">{`${chara.name}${
          chara.honorific || ""
        }`}</span>
      </h1>
      <div className="text-main text-xl">{chara.description}</div>
      <EmbedNode className="my-8 mx-2 md:mx-8" embed={chara.embed} />
      <CharaGalleryAlbum chara={chara} name="art" />
      <CharaGalleryAlbum chara={chara} name="goods" />
      <CharaGalleryAlbum chara={chara} name="3D" />
      <CharaGalleryAlbum chara={chara} name="picture" />
      <CharaGalleryAlbum chara={chara} name="fanart" label="parody" max={12} />
      <CharaGalleryAlbum chara={chara} name="given" label="FAN ART" max={40} />
    </div>
  );
}

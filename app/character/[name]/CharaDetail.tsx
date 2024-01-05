"use client";

import GalleryList from "@/app/gallery/GalleryList";
import { useServerState } from "@/app/components/System/ServerState";
import { useMediaImageState } from "@/app/context/MediaImageState";
import ImageMee, { ImageMeeIcon } from "@/app/components/image/ImageMee";
import { useCharaState } from "../CharaState";
import { useSoundPlayer } from "@/app/sound/SoundPlayer";
import { ReactNode, memo, useEffect, useRef } from "react";
import HTMLReactParser from "html-react-parser";
import {
  EmbedDataType,
  EmbedTextType,
  useEmbedState,
} from "@/app/context/embed/EmbedState";

type DetailProps = {
  name: string;
};

const EmbedNode = memo(function EmbedNode({
  embed,
  embedData,
}: {
  embed: string;
  embedData: EmbedDataType;
}) {
  const list = typeof embed === "string" ? [embed] : embed;
  if (!embed || !embedData === null) return [];
  return list.map((name) =>
    embedData === null ? <></> : HTMLReactParser(embedData[name] || name)
  );
});

export default function CharaDetail({ name }: DetailProps) {
  const { isStatic } = useServerState();
  const { imageItemList } = useMediaImageState();
  const { charaObject } = useCharaState();
  const { RegistPlaylist, current, playlist } = useSoundPlayer();
  const { data: embedData } = useEmbedState();
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
  const galleryGroups = [
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("art") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "ART",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("goods") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "GOODS",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("picture") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "PICTURE",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("given") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "FAN ART",
      max: 40,
    },
  ];
  const embedList =
    chara.embed && embedData
      ? (typeof chara.embed === "string" ? [chara.embed] : chara.embed).map(
          (embed, i) => <EmbedNode key={i} {...{ embed, embedData }} />
        )
      : [];

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
      <h1 className="text-main-deep font-bold text-3xl h-10 flex justify-center items-center">
        {chara.media?.icon ? (
          <ImageMeeIcon
            imageItem={chara.media.icon}
            size={40}
            className="inline-block mr-2"
          />
        ) : null}
        <span>{`${chara.name}${chara.honorific || ""}`}</span>
      </h1>
      <div className="text-main text-xl">{chara.description}</div>
      {embedList.length ? (
        <div className="my-8 mx-2 md:mx-8">
          {embedList.map((node, i) => (
            <div key={i}>{node}</div>
          ))}
        </div>
      ) : null}
      {galleryGroups.map((group, i) => {
        return (
          <div key={i}>
            <GalleryList
              album={group}
              autoDisable={true}
              max={group.max || 20}
              filterButton={true}
            />
          </div>
        );
      })}
    </div>
  );
}

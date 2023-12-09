"use client";

import Image from "next/image";
import { CharaType } from "@/app/character/chara.d";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemType } from "@/app/media/image/MediaImageData.mjs";
import { useCharaData } from "../CharaData";
import { useServerState } from "@/app/components/System/ServerState";

type CharaListItemProps = {
  chara: CharaType;
};

export default function CharaListItem({ chara }: CharaListItemProps) {
  const { isStatic } = useServerState();
  const { charaObject } = useCharaData();
  const currentChara = charaObject && chara.id ? charaObject[chara.id] : null;
  const iconResizedSrc = isStatic
    ? currentChara?.media?.icon?.resized?.find((v) => v.option.mode === "icon")
        ?.src
    : "";
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {currentChara?.media?.icon ? (
        <Image
          src={`${currentChara.media.icon.innerURL}`}
          loader={loaderSet(isStatic, iconResizedSrc)}
          className="inline-block mr-2"
          alt={chara.name}
          width={40}
          height={40}
        />
      ) : null}
      <span className="align-middle">{chara.name}</span>
    </Link>
  );
}

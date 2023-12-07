"use client";

import Image from "next/image";
import { CharaType } from "@/app/character/chara.d";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemType } from "@/app/media/image/MediaImageData.mjs";
import { useCharaData } from "../CharaData";
import { useServerData } from "@/app/components/System/ServerData";

type CharaListItemProps = {
  chara: CharaType;
};

const CharaListItem = ({ chara }: CharaListItemProps) => {
  const { isStatic } = useServerData();
  const charaData = useCharaData();
  const currentChara =
    charaData.charaObject && chara.id ? charaData.charaObject[chara.id] : null;
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {currentChara?.media?.icon ? (
        <Image
          src={`${currentChara.media.icon.innerURL}`}
          loader={loaderSet(
            isStatic,
            chara?.media?.icon?.resized?.find((v) => v.option.mode === "icon")
              ?.src
          )}
          className="inline-block mr-2"
          alt={chara.name}
          width={40}
          height={40}
        />
      ) : null}
      <span className="align-middle">{chara.name}</span>
    </Link>
  );
};

export default CharaListItem;

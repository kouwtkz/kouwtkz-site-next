"use client";

import { CharaType } from "@/app/character/CharaType";
import Link from "next/link";
import { useCharaState } from "./CharaState";
import { ImageMeeIcon } from "@/app/components/image/ImageMee";

type CharaListItemProps = {
  chara: CharaType;
};

export default function CharaListItem({ chara }: CharaListItemProps) {
  const { charaObject } = useCharaState();
  const currentChara = charaObject && chara.id ? charaObject[chara.id] : null;
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {currentChara?.media?.icon ? (
        <ImageMeeIcon
          imageItem={currentChara.media.icon}
          size={40}
          className="inline-block mr-2"
        />
      ) : null}
      <span className="align-middle">{chara.name}</span>
    </Link>
  );
}

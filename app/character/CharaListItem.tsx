"use client";

import { CharaType } from "@/app/character/chara.d";
import Link from "next/link";
import { useCharaData } from "./CharaData";
import ImageMee from "@/app/components/image/ImageMee";

type CharaListItemProps = {
  chara: CharaType;
};

export default function CharaListItem({ chara }: CharaListItemProps) {
  const { charaObject } = useCharaData();
  const currentChara = charaObject && chara.id ? charaObject[chara.id] : null;
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {currentChara?.media?.icon ? (
        <ImageMee
          imageItem={currentChara.media.icon}
          mode="icon"
          className="inline-block mr-2"
          width={40}
          height={40}
        />
      ) : null}
      <span className="align-middle">{chara.name}</span>
    </Link>
  );
}

"use client";

import Image from "next/image";
import { CharaProps } from "@/app/character/chara.d";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemProps } from "@/media/scripts/MediaImageData.mjs";

type CharaListItemProps = {
  chara: CharaProps;
  isStatic?: boolean;
  iconImage?: MediaImageItemProps | null;
};

const CharaListItem: React.FC<CharaListItemProps> = ({
  chara,
  isStatic = false,
  iconImage,
}) => {
  const icon = chara.icon || "";
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {icon ? (
        <Image
          src={icon}
          loader={loaderSet(
            isStatic,
            iconImage?.resized?.find((item) => item.option.mode === "icon")?.src
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

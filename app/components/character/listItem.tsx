"use client";

import Image from "next/image";
import { CharaProps } from "@/app/character/chara.d";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";

type CharaListItemProps = {
  chara: CharaProps;
  isStatic?: boolean;
};

const CharaListItem: React.FC<CharaListItemProps> = ({
  chara,
  isStatic = false,
}) => {
  const icon = chara.icon || "";
  return (
    <Link className="text-3xl m-2" href={`character/${chara.id}`}>
      {icon ? (
        <Image
          src={icon}
          loader={loaderSet(isStatic)}
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

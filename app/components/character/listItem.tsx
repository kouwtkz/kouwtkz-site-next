"use client";

import Image from "next/image";
import { CharaProp } from "@/app/character/chara.d";
import Link from "next/link";
import loaderSet from "@/app/lib/loaderSet";

type CharaListItemProps = {
  chara: CharaProp;
  isStatic?: boolean;
};

const CharaListItem: React.FC<CharaListItemProps> = ({
  chara,
  isStatic = false,
}) => {
  const icon = chara.icon || "";
  return (
    <Link href={`character/${chara.id}`}>
      {icon ? (
        <Image
          src={icon}
          loader={loaderSet(isStatic)}
          className="inline-block mr-2"
          alt={chara.name}
          width={24}
          height={24}
        />
      ) : null}
      <span className="align-middle">{chara.name}</span>
    </Link>
  );
};

export default CharaListItem;

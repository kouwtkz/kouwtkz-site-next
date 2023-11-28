"use client";

import Image from "next/image";
import { CharaProp } from "@/app/character/chara.d";
import Link from "next/link";
// import microCMSLoader from "@/app/lib/microCMSLoader";

type CharaListItemProps = {
  chara: CharaProp;
};

const CharaListItem: React.FC<CharaListItemProps> = ({ chara }) => {
  const icon = chara.icon || "";
  return (
    <Link href={`character/${chara.id}`}>
      {icon ? (
        <Image
          // loader={microCMSLoader}
          className="inline-block mr-2"
          src={icon}
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

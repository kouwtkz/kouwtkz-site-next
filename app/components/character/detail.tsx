"use client";

import { CharaProp } from "@/app/character/chara";
import Image from "next/image";
import microCMSLoader from "@/app/lib/microCMSLoader";

type DetailProps = {
  chara: CharaProp;
};

const CharaDetail: React.FC<DetailProps> = ({ chara }) => {
  const image = chara.image || chara.icon || "";
  return (
    <div className="p-0">
      <div>
        <Image
          loader={microCMSLoader}
          className="inline-block m-4"
          src={image}
          alt={chara.name}
          width={64}
          height={64}
        />
        <span>おなまえ: {chara.name}</span>
      </div>
      <div>{chara.description}</div>
    </div>
  );
};

export default CharaDetail;

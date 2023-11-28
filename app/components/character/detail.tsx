"use client";

import { CharaProp } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";

type DetailProps = {
  chara: CharaProp;
  isStatic?: boolean;
};

const CharaDetail: React.FC<DetailProps> = ({ chara, isStatic = false }) => {
  const image = chara.image || chara.icon || "";
  return (
    <div className="p-0">
      <div>
        <Image
          src={image}
          loader={loaderSet(isStatic)}
          className="inline-block m-4"
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

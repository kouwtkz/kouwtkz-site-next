import React from "react";
import { charaMap } from "./getList";
import Image from "next/image";

export default function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const chara = charaMap.get(params.name);
  if (!chara) return null;
  const image = chara.image || chara.icon || "";
  return (
    <div className="p-0">
      <div>
        <Image className="inline-block m-4" src={image} alt={chara.name} width={64} height={64} />
        <span>おなまえ: {chara.name}</span>
      </div>
      <div>{chara.description}</div>
    </div>
  );
}

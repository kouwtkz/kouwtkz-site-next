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
  const icon = chara.icon || "";
  return (
    <div>
      <div>
        <Image className="inline-block m-4" src={icon} alt={chara.name} width={48} height={48} />
        <span>おなまえ: {chara.name}</span>
      </div>
      <div>{chara.description}</div>
    </div>
  );
}

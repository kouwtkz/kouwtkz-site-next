import React from "react";
import { charaMap, charaList } from "../getList";
import CharaDetail from "../client/detail";
import { isStatic } from "@/app/functions/general";
import { getImageItems } from "@/app/media/MediaImageData.mjs";

export default function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { name } = params;
  const chara = charaMap.get(name);
  const imageList = getImageItems({
    filter: { albumName: "art", tagName: name },
  });
  if (!chara) return null;
  return (
    <CharaDetail chara={chara} isStatic={isStatic} imageList={imageList} />
  );
}

// 静的ビルド時にこれが実行される
async function generateStaticParams() {
  return Object.keys(charaList).map((name) => {
    return { name };
  });
}
export { generateStaticParams }

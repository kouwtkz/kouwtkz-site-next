import React from "react";
import { charaMap, charaList } from "./getList";
import CharaDetail from "@/app/components/character/detail";
import { isStatic } from "@/siteData/site";

export default function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { name } = params;
  const chara = charaMap.get(name);
  if (!chara) return null;
  return <CharaDetail chara={chara} isStatic={isStatic} />
}

// 静的ビルド時にこれが実行される
export async function generateStaticParams() {
  return Object.keys(charaList).map((name) => {
    return { name }
  });
}

import React from "react";
import { charaMap, charaObject } from "../getCharaData";
import CharaDetail from "../client/detail";

export default async function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { name } = params;
  const chara = charaMap.get(name);
  if (!chara) return null;

  if (!chara) return null;
  return (
    <CharaDetail chara={chara} />
  );
}

// 静的ビルド時にこれが実行される
async function generateStaticParams() {
  return Object.keys(charaObject).map((name) => {
    return { name };
  });
}
export { generateStaticParams };

import React from "react";
import { charaMap, charaObject } from "../getCharaData";
import CharaDetail from "../client/detail";
import isStatic from "@/app/components/System/isStatic.mjs";
import Fixed from "./Fixed";

// ↓ 静的ビルドする際のみコメントアウトを外すこと
// export { generateStaticParams };
async function generateStaticParams() {
  return Object.keys(charaObject).map((name) => {
    return { name };
  });
}

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
    <>
      <Fixed isStatic={isStatic} />
      <CharaDetail chara={chara} />
    </>
  );
}

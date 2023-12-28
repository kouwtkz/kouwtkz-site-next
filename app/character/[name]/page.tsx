import React from "react";
import { charaMap, charaObject } from "../getCharaData";
import CharaDetail from "./CharaDetail";
import isStatic from "@/app/components/System/isStatic.mjs";
import Fixed from "./Fixed";

// ↓ 静的ビルドする際のみコメントアウトを外すこと
export { generateStaticParams };
async function generateStaticParams() {
  return Object.keys(charaObject).map((name) => {
    return { name };
  });
}

export default async function Page({
  params,
}: {
  params: { [key: string]: string };
}) {
  const { name } = params;
  return (
    <>
      <Fixed isStatic={isStatic} />
      <CharaDetail name={name} />
    </>
  );
}

import React from "react";
import { charaMap, charaObject } from "../getCharaData.mjs";
import CharaDetail from "./CharaDetail";
import isStatic from "@/app/components/System/isStatic.mjs";
import Fixed from "./Fixed";
import { Metadata } from "next";

export async function generateStaticParams() {
  return Object.keys(charaObject).map((name) => {
    return { name };
  });
}

type Props = { params: { name: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const character = charaMap.get(params.name);
  if (character) return { title: character.name };
  else return {};
}

export default async function Page({ params }: Props) {
  const { name } = params;
  return (
    <>
      <Fixed isStatic={isStatic} />
      <CharaDetail name={name} />
    </>
  );
}

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
  if (!chara) return null;
  const imageList = getImageItems({
    filter: { albumName: ["art", "goods", "given"], tagName: name },
  });
  const headerImagePath = `${chara.headerImage}`;
  const headerImage = chara.headerImage
    ? imageList.find((image) => image.path?.endsWith(headerImagePath))
    : null;
  const charaImagePath = chara?.image || chara?.icon || "";
  const charaImage = charaImagePath
    ? imageList.find((image) => image.path?.endsWith(charaImagePath))
    : null;
  const galleryGroups = [
    {
      list: imageList.filter(
        (image) =>
          image.group?.match("art") && image.tags?.some((v) => v === chara.id)
      ),
      name: "ART",
    },
    {
      list: imageList.filter(
        (image) =>
          image.group?.match("goods") && image.tags?.some((v) => v === chara.id)
      ),
      name: "GOODS",
    },
    {
      list: imageList.filter(
        (image) =>
          image.group?.match("given") && image.tags?.some((v) => v === chara.id)
      ),
      name: "FAN ART",
    },
  ];

  if (!chara) return null;
  return (
    <CharaDetail chara={chara} isStatic={isStatic} charaImage={charaImage} headerImage={headerImage} galleryGroups={galleryGroups} />
  );
}

// 静的ビルド時にこれが実行される
async function generateStaticParams() {
  return Object.keys(charaList).map((name) => {
    return { name };
  });
}
export { generateStaticParams };

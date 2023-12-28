"use client";

import { CharaType } from "@/app/character/chara";
import GalleryList from "@/app/gallery/GalleryList";
import { useServerState } from "@/app/components/System/ServerState";
import { useMediaImageState } from "@/app/context/MediaImageState";
import ImageMee from "@/app/components/image/ImageMee";
import { useCharaData } from "../CharaData";

type DetailProps = {
  name: string;
};

export default function CharaDetail({ name }: DetailProps) {
  const { isStatic } = useServerState();
  const { imageItemList } = useMediaImageState();
  const { charaObject } = useCharaData();
  const chara = charaObject ? charaObject[name] : null;
  if (!chara) return null;
  const galleryGroups = [
    {
      list: imageItemList
        .filter(
          (image) =>
            image.album?.name?.match("art") &&
            image.tags?.some((v) => v === chara.id)
        )
        .slice(0, 20),
      name: "ART",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("goods") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "GOODS",
    },
    {
      list: imageItemList
        .filter(
          (image) =>
            image.album?.name?.match("picture") &&
            image.tags?.some((v) => v === chara.id)
        )
        .slice(0, 20),
      name: "PICTURE",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("given") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "FAN ART",
    },
  ];
  return (
    <div className="p-0">
      {chara.media?.headerImage ? (
        <div>
          <ImageMee
            imageItem={chara.media.headerImage}
            loading="eager"
            unoptimized={isStatic}
            suppressHydrationWarning={true}
            className="inline-block w-[100%]"
          />
        </div>
      ) : null}
      {chara.media?.image ? (
        <div>
          <ImageMee
            imageItem={chara.media.image}
            mode="thumbnail"
            loading="eager"
            suppressHydrationWarning={true}
            className="inline-block m-4"
            style={{ objectFit: "cover" }}
            height={340}
          />
        </div>
      ) : null}
      <h1 className="text-main-deep font-bold text-3xl">{`${chara.name}${
        chara.honorific || ""
      }`}</h1>
      <div className="text-main text-xl">{chara.description}</div>
      {galleryGroups.map((group, i) => {
        return (
          <div key={i}>
            <GalleryList album={group} autoDisable={true} />
          </div>
        );
      })}
    </div>
  );
}

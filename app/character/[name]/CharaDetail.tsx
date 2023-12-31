"use client";

import { CharaType } from "@/app/character/chara";
import GalleryList from "@/app/gallery/GalleryList";
import { useServerState } from "@/app/components/System/ServerState";
import { useMediaImageState } from "@/app/context/MediaImageState";
import ImageMee, { ImageMeeIcon } from "@/app/components/image/ImageMee";
import { useCharaState } from "../CharaState";

type DetailProps = {
  name: string;
};

export default function CharaDetail({ name }: DetailProps) {
  const { isStatic } = useServerState();
  const { imageItemList } = useMediaImageState();
  const { charaObject } = useCharaState();
  const chara = charaObject ? charaObject[name] : null;
  if (!chara) return null;
  const galleryGroups = [
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("art") &&
          image.tags?.some((v) => v === chara.id)
      ),
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
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("picture") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "PICTURE",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.album?.name?.match("given") &&
          image.tags?.some((v) => v === chara.id)
      ),
      name: "FAN ART",
      max: 40,
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
      <h1 className="text-main-deep font-bold text-3xl h-10 flex justify-center items-center">
        {chara.media?.icon ? (
          <ImageMeeIcon
            imageItem={chara.media.icon}
            size={40}
            className="inline-block mr-2"
          />
        ) : null}
        <span>{`${chara.name}${chara.honorific || ""}`}</span>
      </h1>
      <div className="text-main text-xl">{chara.description}</div>
      {galleryGroups.map((group, i) => {
        return (
          <div key={i}>
            <GalleryList
              album={group}
              autoDisable={true}
              max={group.max || 20}
            />
          </div>
        );
      })}
    </div>
  );
}

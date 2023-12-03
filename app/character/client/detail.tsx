"use client";

import { CharaProps } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";
import GalleryList from "@/app/gallery/GalleryList";
import { MediaImageItemProps } from "@/app/media/MediaImageData.mjs";

type DetailProps = {
  chara: CharaProps;
  imageList: Array<MediaImageItemProps>;
  isStatic?: boolean;
};

const CharaDetail: React.FC<DetailProps> = ({
  chara,
  imageList,
  isStatic = false,
}) => {
  const charaImage = chara.image || chara.icon || "";
  const charaImageInfo = charaImage
    ? imageList.find((image) => image.path?.endsWith(charaImage))
    : null;
    const headerImage = `${chara.headerImage}`;
    const headerImageInfo = chara.headerImage
    ? imageList.find((image) => image.path?.endsWith(headerImage))
    : null;
  return (
    <div className="p-0">
      {headerImageInfo ? (
        <div>
          <Image
            src={`${headerImageInfo.innerURL}`}
            loader={loaderSet(isStatic, headerImageInfo.path)}
            className="inline-block w-[100%]"
            alt={chara.name}
            width={headerImageInfo.info?.width}
            height={headerImageInfo.info?.height}
          />
        </div>
      ) : null}
      {charaImageInfo ? (
        <div>
          <Image
            src={`${charaImageInfo.innerURL}`}
            loader={loaderSet(
              isStatic,
              charaImageInfo.resized?.find(
                (item) => item.option.mode === "thumbnail"
              )?.src
            )}
            className="inline-block m-4"
            alt={chara.name}
            width={256}
            height={256}
          />
        </div>
      ) : null}
      <h1 className="text-main-deep font-bold text-3xl">{`${chara.name}${
        chara.honorific || ""
      }`}</h1>
      <div className="text-main text-xl">{chara.description}</div>
      <div>
        <GalleryList
          group={{
            list: imageList.filter(
              (image) =>
                image.group?.match("art") &&
                image.tags?.some((v) => v === chara.id)
            ),
            name: "ART",
          }}
          isStatic={isStatic}
          autoDisable={true}
        />
        <GalleryList
          group={{
            list: imageList.filter(
              (image) =>
                image.group === "goods" &&
                image.tags?.some((v) => v === chara.id)
            ),
            name: "GOODS",
          }}
          isStatic={isStatic}
          autoDisable={true}
        />
        <GalleryList
          group={{
            list: imageList.filter(
              (image) =>
                image.group === "given" &&
                image.tags?.some((v) => v === chara.id)
            ),
            name: "FAN ART",
          }}
          isStatic={isStatic}
          autoDisable={true}
        />
      </div>
    </div>
  );
};

export default CharaDetail;

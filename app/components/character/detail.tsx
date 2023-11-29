"use client";

import { CharaProp } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";
import { ImageDataInfo } from "@/media/scripts/media";
import GalleryList from "../gallery/GalleryList";

type DetailProps = {
  chara: CharaProp;
  imageList: Array<ImageDataInfo>;
  isStatic?: boolean;
};

const CharaDetail: React.FC<DetailProps> = ({
  chara,
  imageList,
  isStatic = false,
}) => {
  const image = chara.image || chara.icon || "";
  const headerImageInfo = chara.headerImage
    ? imageList.find((image) => image.imageUrl === chara.headerImage)
    : null;
  return (
    <div className="p-0">
      {headerImageInfo && headerImageInfo.imageUrl ? (
        <div>
          <Image
            src={headerImageInfo.imageUrl}
            loader={loaderSet(isStatic)}
            className="inline-block w-[100%]"
            alt={chara.name}
            width={headerImageInfo.size?.width}
            height={headerImageInfo.size?.height}
          />
        </div>
      ) : null}
      <div>
        <Image
          src={image}
          loader={loaderSet(isStatic)}
          className="inline-block m-4"
          alt={chara.name}
          width={256}
          height={256}
        />
      </div>
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
                image.tags.some((v) => v === chara.id)
            ),
            name: "ART",
          }}
          autoDisable={true}
        />
        <GalleryList
          group={{
            list: imageList.filter(
              (image) =>
                image.group === "goods" &&
                image.tags.some((v) => v === chara.id)
            ),
            name: "GOODS",
          }}
          autoDisable={true}
        />
        <GalleryList
          group={{
            list: imageList.filter(
              (image) =>
                image.group === "given" &&
                image.tags.some((v) => v === chara.id)
            ),
            name: "FAN ART",
          }}
          autoDisable={true}
        />
      </div>
    </div>
  );
};

export default CharaDetail;

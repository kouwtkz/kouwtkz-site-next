"use client";

import { CharaType } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";
import GalleryList from "@/app/gallery/GalleryList";
import { useServerData } from "@/app/components/System/ServerData";
import { useDataMediaImage } from "@/app/media/DataMediaImage";

type DetailProps = {
  chara: CharaType;
};

const CharaDetail: React.FC<DetailProps> = ({ chara }) => {
  const { isStatic } = useServerData();
  const { imageItemList } = useDataMediaImage();
  const galleryGroups = [
    {
      list: imageItemList.filter(
        (image) =>
          image.group?.match("art") && image.tags?.some((v) => v === chara.id)
      ),
      name: "ART",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.group?.match("goods") && image.tags?.some((v) => v === chara.id)
      ),
      name: "GOODS",
    },
    {
      list: imageItemList.filter(
        (image) =>
          image.group?.match("given") && image.tags?.some((v) => v === chara.id)
      ),
      name: "FAN ART",
    },
  ];
  const imageList = imageItemList.filter((image) =>
    ["art", "goods", "given"].find((fg) => fg === image.group)
  );
  const headerImagePath = `${chara.headerImage}`;
  const headerImage = chara.headerImage
    ? imageList.find((image) => image.path?.endsWith(headerImagePath))
    : null;
  const charaImagePath = chara?.image || chara?.icon || "";
  const charaImage = charaImagePath
    ? imageList.find((image) => image.path?.endsWith(charaImagePath))
    : null;

  return (
    <div className="p-0">
      {headerImage ? (
        <div>
          <Image
            src={`${headerImage.innerURL}`}
            loader={loaderSet(isStatic, headerImage.path)}
            className="inline-block w-[100%]"
            alt={chara.name}
            width={headerImage.info?.width}
            height={headerImage.info?.height}
          />
        </div>
      ) : null}
      {charaImage ? (
        <div>
          <Image
            src={`${charaImage.innerURL}`}
            loader={loaderSet(
              isStatic,
              charaImage.resized?.find(
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
      {galleryGroups.map((group, i) => {
        return (
          <div key={i}>
            <GalleryList album={group} autoDisable={true} />
          </div>
        );
      })}
    </div>
  );
};

export default CharaDetail;

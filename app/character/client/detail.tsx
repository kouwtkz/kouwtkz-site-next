"use client";

import { CharaType } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";
import GalleryList from "@/app/gallery/GalleryList";
import { MediaImageAlbumType, MediaImageItemType } from "@/app/media/MediaImageData.mjs";
import { useServerData } from "@/app/components/System/ServerData";

type DetailProps = {
  chara: CharaType;
  headerImage?: MediaImageItemType | null;
  charaImage?: MediaImageItemType | null;
  galleryGroups: Array<MediaImageAlbumType>;
};

const CharaDetail: React.FC<DetailProps> = ({
  chara,
  headerImage,
  charaImage,
  galleryGroups,
}) => {
  const { isStatic } = useServerData();
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
            <GalleryList group={group} autoDisable={true} />
          </div>
        );
      })}
    </div>
  );
};

export default CharaDetail;

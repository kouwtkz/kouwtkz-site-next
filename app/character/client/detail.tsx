"use client";

import { CharaProps } from "@/app/character/chara";
import Image from "next/image";
import loaderSet from "@/app/lib/loaderSet";
import GalleryList from "@/app/gallery/GalleryList";
import { MediaImageAlbumProps, MediaImageItemProps } from "@/app/media/MediaImageData.mjs";

type DetailProps = {
  chara: CharaProps;
  headerImage?: MediaImageItemProps | null;
  charaImage?: MediaImageItemProps | null;
  galleryGroups: Array<MediaImageAlbumProps>;
  isStatic?: boolean;
};

const CharaDetail: React.FC<DetailProps> = ({
  chara,
  headerImage,
  charaImage,
  galleryGroups,
  isStatic = false,
}) => {
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
            <GalleryList group={group} isStatic={isStatic} autoDisable={true} />
          </div>
        );
      })}
    </div>
  );
};

export default CharaDetail;

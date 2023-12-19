"use client";

import { CharaType } from "@/app/character/chara";
import GalleryList from "@/app/gallery/GalleryList";
import { useServerState } from "@/app/components/System/ServerState";
import { useMediaImageState } from "@/app/media/image/MediaImageState";
import ImageMee from "@/app/components/image/ImageMee";

type DetailProps = {
  chara: CharaType;
};

export default function CharaDetail({ chara }: DetailProps) {
  const { isStatic } = useServerState();
  const { imageItemList } = useMediaImageState();
  const galleryGroups = [
    {
      list: imageItemList.filter(
        (image) =>
          image.group?.match("art") && image.tags?.some((v) => v === chara.id)
      ).slice(0, 20),
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
          image.group?.match("picture") && image.tags?.some((v) => v === chara.id)
      ).slice(0, 20),
      name: "PICTURE",
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
    ["art", "goods", "given", "charaImages", "charaIcon"].find(
      (fg) => fg === image.group
    )
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
          <ImageMee
            imageItem={headerImage}
            loading="eager"
            unoptimized={isStatic}
            suppressHydrationWarning={true}
            className="inline-block w-[100%]"
          />
        </div>
      ) : null}
      {charaImage ? (
        <div>
          <ImageMee
            imageItem={charaImage}
            mode="thumbnail"
            loading="eager"
            unoptimized={isStatic}
            suppressHydrationWarning={true}
            className="inline-block m-4"
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
}

import { ImageDataObject } from "@/media/scripts/media";
import { dammyImageSize } from "@/media/scripts/dammy";

import React from "react";
import Image from "next/image";
import Link from "next/link";
type Props = {
  group: ImageDataObject | null;
  size?: number;
  label?: string;
  showLabel?: boolean;
  max?: number;
};

const GalleryList: React.FC<Props> = (Props) => {
  const group = Props.group;
  if (group === null) return null;
  const thumb_size = Props.size || 320;
  const showLabel = Props.showLabel !== undefined ? Props.showLabel : true;
  const max = Props.max || 1000;
  return (
    <div className="w-[100%]">
      {showLabel ? (
        <h2 className="pt-12 mb-6 text-6xl font-LuloClean text-center text-main">
          {Props.label || group.name}
        </h2>
      ) : null}
      <div className="flex flex-wrap max-w-[1120px] mx-auto">
        {group.list
          .map((image, key) => {
            const size = image.size || dammyImageSize;
            const thumb = {
              width: !size.wide
                ? thumb_size
                : (thumb_size * size.width) / size.height,
              height: size.wide
                ? thumb_size
                : (thumb_size * size.height) / size.width,
            };
            return (
              <div
                key={key}
                className="w-[24.532%] pt-[24.532%] m-[0.234%] relative"
              >
                <Image
                  src={`${group.path}/${image.src || ""}`}
                  alt={image.name || image.src}
                  width={thumb.width}
                  height={thumb.height}
                  style={{ objectFit: "cover" }}
                  className="absolute w-[100%] h-[100%] top-0"
                />
              </div>
            );
          })
          .filter((v, i) => i < max)}
      </div>
    </div>
  );
};

export default GalleryList;

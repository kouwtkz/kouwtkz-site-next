import React from "react";
import Image from "next/image";
import {
  MediaImageItemType,
  ResizeMode,
} from "@/app/media/image/MediaImageType";
import loaderSet from "./loaderSet";
import { useServerState } from "../System/ServerState";

type ImageMeeProps = {
  imageItem?: MediaImageItemType;
  width?: number;
  height?: number;
  mode?: ResizeMode;
  unoptimized?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function ImageMee({
  imageItem,
  mode = "simple",
  alt,
  loading,
  src,
  srcSet,
  width,
  height,
  placeholder,
  ...attributes
}: ImageMeeProps) {
  const { isStatic } = useServerState();
  src = src || imageItem?.innerURL || "";
  alt = alt || imageItem?.name || imageItem?.src || "";
  if (width) {
    if (!height)
      height = Math.floor(
        (width * (imageItem?.info?.height || 1)) / (imageItem?.info?.width || 1)
      );
  } else if (height) {
    width = Math.floor(
      (height * (imageItem?.info?.width || 1)) / (imageItem?.info?.height || 1)
    );
  }
  return (
    <Image
      {...{ src, alt }}
      loader={loaderSet(
        isStatic,
        mode !== "simple"
          ? imageItem?.resized?.find((item) => item.option.mode === mode)
              ?.src || src
          : src
      )}
      {...{
        ...{
          width: width || imageItem?.info?.width,
          height: height || imageItem?.info?.height,
        },
        ...attributes,
      }}
    />
  );
}

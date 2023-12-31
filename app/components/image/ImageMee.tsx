/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { MediaImageItemType } from "@/imageScripts/MediaImageDataType";
import { ResizeMode } from "@/imageScripts/MediaImageYamlType";

interface ImageMeeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageItem?: MediaImageItemType;
  width?: number;
  height?: number;
  mode?: ResizeMode;
  unoptimized?: boolean;
}

export default function ImageMee({
  imageItem,
  mode = "simple",
  alt: _alt,
  src: _src,
  loading,
  srcSet,
  width,
  height,
  placeholder,
  unoptimized,
  ...attributes
}: ImageMeeProps) {
  const [loaded, setLoaded] = useState(false);
  const src = _src || imageItem?.URL || "";
  const alt = _alt || imageItem?.name || imageItem?.src || "";
  const thumbnail = imageItem?.resized?.find(
    (item) => item.mode === "thumbnail"
  )?.src;
  const imageSrc =
    mode === "simple"
      ? src
      : mode === "thumbnail" && thumbnail
      ? thumbnail
      : imageItem?.resized?.find((item) => item.mode === mode)?.src || src;
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
  const setAttr = {
    ...{
      ...{
        width: width || imageItem?.info?.width,
        height: height || imageItem?.info?.height,
      },
      ...attributes,
    },
  };
  return (
    <>
      {mode === "simple" && thumbnail ? (
        <>
          <img src={loaded ? imageSrc : thumbnail} alt={alt} {...setAttr} />
          {!loaded ? (
            <img
              src={imageSrc}
              alt="loading"
              className="hidden"
              onLoad={() => {
                setLoaded(true);
              }}
            />
          ) : null}
        </>
      ) : (
        <img src={imageSrc} alt={alt} {...setAttr} />
      )}
    </>
  );
}

interface ImageMeeSimpleProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  imageItem: MediaImageItemType;
}

export function ImageMeeIcon({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "icon", width: size, height: size });
}
export function ImageMeeThumbnail({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "thumbnail", width: size, height: size });
}

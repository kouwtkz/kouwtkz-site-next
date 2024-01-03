/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { MediaImageItemType } from "@/MediaScripts/MediaImageDataType";
import { ResizeMode } from "@/MediaScripts/MediaImageYamlType";

interface ImageMeeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageItem?: MediaImageItemType;
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
  return (
    <>
      {mode === "simple" && thumbnail ? (
        <>
          <img src={loaded ? imageSrc : thumbnail} alt={alt} {...attributes} />
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
        <img src={imageSrc} alt={alt} {...attributes} />
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

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { ResizeMode } from "@/mediaScripts/MediaImageYamlType";

interface ImageMeeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageItem?: MediaImageItemType;
  hoverSrc?: string;
  hoverImageItem?: MediaImageItemType;
  mode?: ResizeMode;
  unoptimized?: boolean;
}

export default function ImageMee({
  imageItem,
  mode = "simple",
  alt: _alt,
  src: _src,
  hoverSrc,
  hoverImageItem,
  loading,
  srcSet,
  placeholder,
  unoptimized,
  ...attributes
}: ImageMeeProps) {
  const [loaded, setLoaded] = useState(false);
  const refImg = useRef<HTMLImageElement | null>(null);
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
        <img
          src={imageSrc}
          alt={alt}
          ref={refImg}
          onMouseEnter={() => {
            if (refImg.current) {
              if (hoverSrc) refImg.current.src = hoverSrc;
              else if (hoverImageItem?.URL)
                refImg.current.src = hoverSrc || hoverImageItem?.URL;
            }
          }}
          onMouseLeave={() => {
            if (refImg.current) {
              if (hoverSrc || hoverImageItem) refImg.current.src = imageSrc;
            }
          }}
          {...attributes}
        />
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

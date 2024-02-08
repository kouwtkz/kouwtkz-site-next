/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { ResizeMode } from "@/mediaScripts/MediaImageYamlType";
const blankImage =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

interface ImageMeeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageItem?: MediaImageItemType;
  hoverSrc?: string;
  hoverImageItem?: MediaImageItemType;
  mode?: ResizeMode;
  unoptimized?: boolean;
  size?: number;
  loadingScreen?: boolean;
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
  size,
  width,
  height,
  loadingScreen = false,
  className,
  style,
  ...attributes
}: ImageMeeProps) {
  const [loaded, setLoaded] = useState(false);
  const refImg = useRef<HTMLImageElement | null>(null);
  const refImgSrc = useRef("");
  const src = _src || imageItem?.URL || "";
  if (refImgSrc.current !== src) {
    if (loaded) setLoaded(false);
    refImgSrc.current = src;
  }
  const alt = _alt || imageItem?.name || imageItem?.src || "";
  const thumbnail = imageItem?.resized?.find(
    (item) => item.mode === "thumbnail"
  )?.src;

  if (size) {
    [width, height] = new Array<number>(2).fill(size);
  } else if (imageItem?.size) {
    if (!width)
      width = height
        ? Math.ceil((imageItem.size.w * Number(height)) / imageItem.size.h)
        : imageItem.size.w;
    if (!height)
      height = width
        ? Math.ceil((imageItem.size.h * Number(width)) / imageItem.size.w)
        : imageItem.size.h;
  }
  const imageSrc =
    mode === "simple"
      ? src
      : mode === "thumbnail" && thumbnail
      ? thumbnail
      : imageItem?.resized?.find((item) => item.mode === mode)?.src || src;
  const onMouseEvent = hoverSrc
    ? {
        onMouseEnter: () => {
          if (refImg.current) {
            if (hoverSrc) refImg.current.src = hoverSrc;
            else if (hoverImageItem?.URL)
              refImg.current.src = hoverSrc || hoverImageItem?.URL;
          }
        },
        onMouseLeave: () => {
          if (refImg.current) {
            if (hoverSrc || hoverImageItem) refImg.current.src = imageSrc;
          }
        },
      }
    : {};
  const loadThumbMode = mode === "simple" && thumbnail;
  const mainImgSrc = !loaded && loadThumbMode ? thumbnail : imageSrc;
  const nowLoadingNotThumb = !loaded && mainImgSrc === imageSrc;
  const blankMode = nowLoadingNotThumb && loadingScreen;
  if (blankMode)
    style = {
      ...style,
      background: "var(--main-color-grayish-fluo)",
    };
  return (
    <>
      <img
        src={blankMode ? blankImage : mainImgSrc}
        alt={alt}
        ref={refImg}
        {...{
          className,
          width,
          height,
          style,
        }}
        {...onMouseEvent}
        {...attributes}
      />
      {!loaded ? (
        <>
          <img
            src={imageSrc}
            alt="loading"
            hidden
            onLoad={() => {
              setLoaded(true);
            }}
          />
        </>
      ) : null}
    </>
  );
}

interface ImageMeeSimpleProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageItem: MediaImageItemType;
  size?: number;
  loadingScreen?: boolean;
}

export function ImageMeeIcon({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "icon" });
}
export function ImageMeeThumbnail({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "thumbnail" });
}

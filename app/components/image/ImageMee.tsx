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
  return (
    <>
      <img
        src={mainImgSrc}
        alt={alt}
        ref={refImg}
        {...{ className, style }}
        hidden={nowLoadingNotThumb}
        {...onMouseEvent}
        {...attributes}
      />
      {nowLoadingNotThumb && loadingScreen ? (
        <div
          {...{
            className: className,
            style: {
              ...style,
              background: "var(--main-color-grayish-fluo)",
            },
          }}
        />
      ) : null}
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
  size?: number;
  imageItem: MediaImageItemType;
  loadingScreen?: boolean;
}

export function ImageMeeIcon({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "icon", width: size, height: size });
}
export function ImageMeeThumbnail({ size, ...args }: ImageMeeSimpleProps) {
  return ImageMee({ ...args, mode: "thumbnail", width: size, height: size });
}

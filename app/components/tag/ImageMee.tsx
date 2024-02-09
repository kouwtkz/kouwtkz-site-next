/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  style,
  ...attributes
}: ImageMeeProps) {
  const [showIndex, setShowIndex] = useState<{ index: number; max: number }>({
    index: 0,
    max: 0,
  });
  const refImg = useRef<HTMLImageElement | null>(null);
  const refImgSrc = useRef("");
  const refShowList = useRef<string[]>([]);

  const src = _src || imageItem?.URL || "";
  const alt = _alt || imageItem?.name || imageItem?.src || "";

  [width, height] = useMemo(() => {
    if (size) {
      return new Array<number>(2).fill(size);
    } else if (imageItem?.size) {
      return [
        height
          ? Math.ceil((imageItem.size.w * Number(height)) / imageItem.size.h)
          : imageItem.size.w,
        width
          ? Math.ceil((imageItem.size.h * Number(width)) / imageItem.size.w)
          : imageItem.size.h,
      ];
    } else {
      return [width, height];
    }
  }, [imageItem, size, width, height]);
  const thumbnail = useMemo(
    () => imageItem?.resized?.find((item) => item.mode === "thumbnail")?.src,
    [imageItem]
  );
  const imageSrc = useMemo(
    () =>
      mode === "simple"
        ? src
        : mode === "thumbnail" && thumbnail
        ? thumbnail
        : imageItem?.resized?.find((item) => item.mode === mode)?.src || src,
    [imageItem, mode, src, thumbnail]
  );
  const imageShowList = useMemo(() => {
    const list: string[] = [];
    if (mode === "simple" && thumbnail) list.push(thumbnail);
    else list.push(blankImage);
    list.push(imageSrc);
    return list;
  }, [imageSrc, mode, thumbnail]);

  let index = showIndex.index;
  if (refImgSrc.current !== src) {
    index = 0;
    setShowIndex({ index, max: imageShowList.length - 1 });
    refImgSrc.current = src;
    refShowList.current = imageShowList;
  }
  const mainImgSrc = imageShowList[index];

  return (
    <img
      src={mainImgSrc}
      alt={alt}
      ref={refImg}
      {...{
        width,
        height,
        style: {
          ...style,
          ...(loadingScreen
            ? { background: "var(--main-color-grayish-fluo)" }
            : {}),
        },
      }}
      onLoad={() => {
        if (showIndex.index < showIndex.max)
          setShowIndex({ ...showIndex, index: showIndex.index + 1 });
      }}
      {...(hoverSrc
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
        : {})}
      {...attributes}
    />
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

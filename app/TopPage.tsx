"use client";

import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import fadein from "./styles/transitions/fadein.module.scss";
import ImageMee from "./components/tag/ImageMee";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import { filterPickFixed } from "./gallery/FilterImages";
import { PostListWindow } from "./blog/List/PostListWindow";

export function TopPageImage() {
  const { imageItemList } = useMediaImageState();
  const topImages = filterPickFixed({
    images: imageItemList,
    name: "topImage",
  });
  const [topImageState, setTopImage] = useState<MediaImageItemType>();
  const firstLoad = useRef(true);
  const currentTopImage = useRef<MediaImageItemType | null>(null);
  if (topImageState && currentTopImage) currentTopImage.current = topImageState;
  const topImage = currentTopImage.current;
  const setRndTopImage = () => {
    const curIndex = currentTopImage.current
      ? topImages.findIndex(
          (image) => image.src === currentTopImage.current?.src
        )
      : -1;
    let imageIndex = Math.floor(
      Math.random() * (topImages.length - (curIndex >= 0 ? 1 : 0))
    );
    if (curIndex >= 0 && curIndex <= imageIndex) imageIndex++;
    setTopImage(topImages[imageIndex]);
  };
  if (firstLoad.current && imageItemList.length > 0) {
    setRndTopImage();
    firstLoad.current = false;
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setRndTopImage();
    }, 10000);
    return () => clearInterval(timer);
  });

  return (
    <div className="h-[48rem] min-h-[30rem] max-h-[70vh] wide">
      {currentTopImage.current && topImage ? (
        <TransitionGroup className="h-[100%] wrapper relative">
          <CSSTransition
            key={currentTopImage.current.src || ""}
            classNames={fadein}
            timeout={750}
          >
            <ImageMee
              imageItem={topImage}
              loading="eager"
              className="w-[100%] h-[100%] absolute"
              suppressHydrationWarning={true}
            />
          </CSSTransition>
        </TransitionGroup>
      ) : (
        <div className="h-[100%] bg-main-grayish-fluo"></div>
      )}
    </div>
  );
}

export function TopPagePostList() {
  return (
    <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row justify-start items-center flex-wrap">
      <Link href="blog" className="mx-2">
        <h3 className="text-3xl">ブログ</h3>
      </Link>
      <PostListWindow
        options={{ where: { title: { not: "" } } }}
        className="flex-1 text-lg my-4 lg:my-0 flex lg:flex-row flex-col justify-left max-w-lg h-32 lg:max-w-max lg:h-auto"
      />
    </div>
  );
}
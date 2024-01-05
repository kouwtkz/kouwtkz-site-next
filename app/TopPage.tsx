"use client";

import { MediaImageItemType } from "@/MediaScripts/MediaImageDataType";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import MultiParser from "./components/functions/MultiParser";
import PostListWindow from "./blog/List/PostListWindow";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import fadein from "./styles/transitions/fadein.module.scss";
import ImageMee from "./components/image/ImageMee";
import { useMediaImageState } from "@/app/context/MediaImageState";

function Main() {
  const { imageItemList } = useMediaImageState();
  const topImages = imageItemList.filter((image) => image.topImage);
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
    if (imageIndex >= curIndex) imageIndex++;
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
    <div>
      {currentTopImage.current && topImage ? (
        <TransitionGroup className="wrapper h-80 relative">
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
        <div className="h-80 bg-main-grayish-fluo"></div>
      )}
      <main className="pb-8">
        <div className="my-8">
          <div className="text-4xl [&>*]:m-4 mb-8">
            <h1>
              <MultiParser only={{ toTwemoji: true }}>
                わたかぜコウのサイトへようこそ！🐏
              </MultiParser>
            </h1>
            <div>
              <Link href="gallery">ギャラリー</Link>
            </div>
            <div>
              <Link href="character">キャラクター</Link>
            </div>
            <div>
              <Link href="sound">サウンド</Link>
            </div>
            <div>
              <Link href="schedule">スケジュール</Link>
            </div>
            <div>
              <Link href="about">このサイトについて</Link>
            </div>
            <div>
              <Link href="setting">せってい</Link>
            </div>
          </div>
        </div>
        <PostListWindow
          heading={
            <Link href="blog">
              <h3 className="inline-block text-3xl">ブログ</h3>
            </Link>
          }
          className="max-w-md h-40 mx-auto my-6"
        />
      </main>
    </div>
  );
}
export default function TopPage() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

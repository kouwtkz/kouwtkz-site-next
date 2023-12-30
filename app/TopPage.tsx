"use client";

import { MediaImageItemType } from "@/imageScripts/MediaImageDataType";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import MultiParser from "./components/functions/MultiParser";
import Notice from "./blog/Notice";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import fadein from "./styles/transitions/fadein.module.scss";
import ImageMee from "./components/image/ImageMee";
import { useMediaImageState } from "@/app/context/MediaImageState";

export default function TopPage() {
  const { imageItemList } = useMediaImageState();
  const topImages = imageItemList.filter((image) => image.topImage);
  const [topImageState, setTopImage] = useState<MediaImageItemType>();
  const firstLoad = useRef(true);
  const imageRnd = (images: MediaImageItemType[]) =>
    images[Math.floor(Math.random() * images.length)];
  const currentTopImage = useRef<MediaImageItemType | null>(null);
  if (topImageState && currentTopImage) currentTopImage.current = topImageState;
  const topImage = currentTopImage.current;
  const setRndTopImage = () => {
    const filterTopImages = currentTopImage.current
      ? topImages.filter((image) => image.src !== currentTopImage.current?.src)
      : topImages;
    setTopImage(imageRnd(filterTopImages));
  };
  useEffect(() => {
    if (firstLoad.current && imageItemList.length > 0) {
      setRndTopImage();
      firstLoad.current = false;
    }
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
              <Link href="blog">ブログ</Link>
            </div>
            <div>
              <Link href="sound">サウンド</Link>
            </div>
            <div>
              <Link href="special">スペシャルページ</Link>
            </div>
            <div>
              <Link href="about">このサイトについて</Link>
            </div>
            <div>
              <Link href="setting">せってい</Link>
            </div>
          </div>
        </div>
        <Notice className="h-40" />
      </main>
    </div>
  );
}

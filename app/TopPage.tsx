"use client";

import { MediaImageItemType } from "@/imageScripts/MediaImageType";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import MultiParser from "./components/functions/MultiParser";
import Notice from "./blog/Notice";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import fadein from "./styles/transitions/fadein.module.scss";
import ImageMee from "./components/image/ImageMee";

type TopPageProps = {
  topImages?: MediaImageItemType[];
};

export default function TopPage({ topImages = [] }: TopPageProps) {
  const [topImageState, setTopImage] = useState<MediaImageItemType>();
  const imageRnd = (images: MediaImageItemType[]) =>
    images[Math.floor(Math.random() * images.length)];
  const currentTopImage = useRef<MediaImageItemType>(imageRnd(topImages));
  if (topImageState) currentTopImage.current = topImageState;
  const topImage = currentTopImage.current;
  useEffect(() => {
    const timer = setInterval(() => {
      setTopImage(
        imageRnd(
          topImages.filter((image) => image.src !== currentTopImage.current.src)
        )
      );
    }, 10000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      {currentTopImage.current ? (
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
        <></>
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

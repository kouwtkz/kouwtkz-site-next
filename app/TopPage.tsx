"use client";

import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemType } from "@/app/media/image/MediaImageType";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useServerState } from "./components/System/ServerState";
import MultiParser from "./components/functions/MultiParser";
import Notice from "./blog/Notice";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import fadein from "./styles/transitions/fadein.module.scss";

type TopPageProps = {
  topImages?: MediaImageItemType[];
};

export default function TopPage({ topImages = [] }: TopPageProps) {
  const { isStatic } = useServerState();
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
    <>
      <TransitionGroup className="wrapper h-80 relative">
        <CSSTransition
          key={currentTopImage.current.src}
          classNames={fadein}
          timeout={750}
        >
          <Image
            src={`${topImage.innerURL}`}
            loader={loaderSet(isStatic, topImage.path)}
            suppressHydrationWarning={isStatic}
            alt={topImage.name || topImage.src}
            width={topImage.info?.width}
            height={topImage.info?.height}
            loading="eager"
            unoptimized={isStatic}
            className="w-[100%] h-[100%] absolute"
          />
        </CSSTransition>
      </TransitionGroup>
      <main className="pb-8">
        <div className="my-8">
          <div className="text-4xl [&>*]:m-4 mb-8">
            <h1>
              <MultiParser only={{ toTwemoji: true }}>
                わたかぜコウのサイトへようこそ！🐏
              </MultiParser>
            </h1>
            <div>
              <Link href="gallery">イラスト</Link>
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
              <Link href="setting">せってい</Link>
            </div>
          </div>
        </div>
        <Notice className="h-40" />
      </main>
    </>
  );
}

"use client";

import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemType } from "@/app/media/image/MediaImageType";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useServerState } from "./components/System/ServerState";
import MultiParser from "./components/functions/MultiParser";
import Notice from "./blog/Notice";

type TopPageProps = {
  topImages?: MediaImageItemType[];
};

export default function TopPage({ topImages = [] }: TopPageProps) {
  const { isStatic } = useServerState();
  const topImage = topImages[Math.floor(Math.random() * topImages.length)];
  console.log(topImage);
  return (
    <>
      {topImage ? (
        <Image
          src={`${topImage.innerURL}`}
          alt={topImage.name || topImage.src}
          width={topImage.info?.width}
          height={topImage.info?.height}
          loading="eager"
          unoptimized={isStatic}
          className="w-[100%] h-80"
          suppressHydrationWarning={true}
        />
      ) : (
        <div className="w-[100%] h-80" />
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

"use client";

import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemType } from "@/app/media/image/MediaImageType";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useServerState } from "./components/System/ServerState";
import MultiParser from "./components/functions/MultiParser";
import MenuButton from "./svg/MenuButton";
import { useMediaImageState } from "./media/image/MediaImageState";
import { usePostState } from "./blog/PostState";
import { findMany } from "./blog/functions/findMany";

type TopPageProps = {
  topImage?: MediaImageItemType | null;
};

export default function TopPage() {
  const { isStatic } = useServerState();
  const { imageItemList } = useMediaImageState();
  const topImages = imageItemList.filter((image) => image.topImage);
  const topImage = topImages[Math.floor(Math.random() * topImages.length)];
  const { posts } = usePostState();
  const topPosts = findMany({
    list: posts,
    take: 3,
    where: { category: "お知らせ" },
  });
  return (
    <>
      {topImage ? (
        <Image
          src={`${topImage.innerURL}`}
          loader={loaderSet(isStatic, topImage.path)}
          alt={topImage.name || topImage.src}
          width={topImage.info?.width}
          height={topImage.info?.height}
          loading="eager"
          className="w-[100%] h-80"
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
        <div className="my-8">
          <h3 className="text-2xl my-4">お知らせ</h3>
          <div className="h-24 my-4">
            {topPosts.map((post, i) => (
              <div className="m-1" key={i}>
                <Link href={`/blog?postId=${post.postId}`}>
                  <MultiParser only={{ toTwemoji: true }}>
                    {post.title}
                  </MultiParser>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

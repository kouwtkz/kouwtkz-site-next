"use client";

import loaderSet from "@/app/lib/loaderSet";
import { MediaImageItemProps } from "@/app/media/MediaImageData.mjs";
import { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Twemoji from "react-twemoji";
type TopPageProps = {
  topImage?: MediaImageItemProps | null;
  isStatic?: boolean;
  topPosts?: Array<Post>;
};

const TopPage: React.FC<TopPageProps> = ({
  topImage,
  isStatic = false,
  topPosts = [],
}) => {
  const html = document.documentElement;
  return (
    <>
      {topImage ? (
        <Image
          src={`${topImage.innerURL}`}
          loader={loaderSet(isStatic, topImage.path)}
          alt={topImage.name || topImage.src}
          width={topImage.info?.width}
          height={topImage.info?.height}
          className="w-[100%] h-80"
        />
      ) : null}
      <Twemoji options={{ className: "emoji" }}>
        <main className="pb-8">
          <div className="my-8">
            <div className="text-4xl [&>*]:m-4 mb-8">
              <h1>はろはろめぇめぇ？</h1>
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
                <p onClick={() => html.classList.toggle("theme-orange")} className="cursor-pointer text-main">テーマきりかえ</p>
              </div>
            </div>
          </div>
          <div className="my-8">
            <h3 className="text-2xl my-4">お知らせ</h3>
            <div>
              {topPosts.map((post, i) => (
                <div className="m-1" key={i}>
                  <Link href={`/blog/post/${post.postId}`}>{post.title}</Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </Twemoji>
    </>
  );
};

export default TopPage;

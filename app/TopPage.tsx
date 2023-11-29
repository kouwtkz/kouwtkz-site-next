"use client";

import loaderSet from "@/app/lib/loaderSet";
import { ImageDataInfo } from "@/media/scripts/media";
import { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Twemoji from "react-twemoji";
type TopPageProps = {
  topImage?: ImageDataInfo;
  isStatic?: boolean;
  topPosts?: Array<Post>;
};

const TopPage: React.FC<TopPageProps> = ({
  topImage,
  isStatic = false,
  topPosts = [],
}) => {
  return (
    <>
      {topImage ? (
        <Image
          src={`${topImage.imageUrl}`}
          loader={loaderSet(isStatic)}
          alt={topImage.name || topImage.src}
          width={topImage.size?.width}
          height={topImage.size?.height}
          className="w-[100%] h-80"
        />
      ) : null}
      <Twemoji options={{ className: "emoji" }}>
        <main className="pb-8">
          <div className="my-8">
            <div className="text-4xl [&>*]:m-4 mb-8">
              <h1>はろはろめぇめぇ</h1>
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

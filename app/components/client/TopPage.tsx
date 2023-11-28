"use client";

import loaderSet from "@/app/lib/loaderSet";
import { ImageDataInfo } from "@/media/scripts/media";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Twemoji from "react-twemoji";
type TopPageProps = {
  topImage?: ImageDataInfo;
  isStatic?: boolean;
};

const TopPage: React.FC<TopPageProps> = ({ topImage, isStatic = false }) => {
  return (
    <>
      {topImage ? (
        <Image
          loader={loaderSet(isStatic)}
          src={`${topImage.imageUrl}`}
          alt={topImage.name || topImage.src}
          width={topImage.size?.width}
          height={topImage.size?.height}
          className="w-[100%] h-80"
        />
      ) : null}
      <Twemoji options={{ className: "emoji" }}>
        <main className="p-8">
          <div className="text-4xl [&>*]:m-4">
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
          </div>
        </main>
      </Twemoji>
    </>
  );
};

export default TopPage;

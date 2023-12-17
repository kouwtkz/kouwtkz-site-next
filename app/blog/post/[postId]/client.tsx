"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Post, User } from "@/app/blog/Post.d";
import MultiParser from "@/app/components/functions/MultiParser";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";

type PostDetailProps = {
  post?: Post & { user: { name: string | null; icon: string | null } | null };
};

const TopPage = ({ post }: PostDetailProps) => {
  const router = useRouter();
  useHotkeys("b", () => router.back());
  if (!post) return null;
  return (
    <>
      <div className="text-lg">
        <Link href="/blog">
          <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
            MINI BLOG
          </h2>
        </Link>
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          <div>
            <MultiParser only={{ toTwemoji: true }} className="inline-block">
              <h1 className="text-4xl text-main-deep font-bold mx-2 my-4 inline-block">
                {post.title}
              </h1>
            </MultiParser>
            <div className="inline-block">
              <div className="mx-3 underline inline-block">
                <Link href={`/blog/?q=%23${post.category}`}>
                  {post.category}
                </Link>
              </div>
            </div>
          </div>
          <MultiParser detailsOpen={true}>{post.body}</MultiParser>
          <div className="text-right [&>*]:ml-4">
            {post.draft ? (
              <span className="text-main-grayish">(下書き)</span>
            ) : post.date.getTime() > Date.now() ? (
              <span className="text-main-grayish">(予約)</span>
            ) : (
              <></>
            )}
            <span className="text-main">{post.user?.name}</span>
            {post.date ? (
              <span className="text-main-grayish">
                {post.date.toLocaleString("ja", opt)}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopPage;

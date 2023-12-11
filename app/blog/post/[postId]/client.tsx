"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Post, User } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import date_format from "@/app/components/functions/date_format";

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
              <span className="mx-3 underline">
                <Link href={`/blog/?q=%23${post.category}`}>
                  {post.category}
                </Link>
              </span>
            </div>
          </div>
          <MultiParser detailsOpen={true}>{post.body}</MultiParser>
          <div className="text-right [&>*]:ml-4">
            <span className="text-main">{post.user?.name}</span>
            <span className="text-main-grayish">
              {date_format("Y/m/d H:i", post.date, true)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopPage;

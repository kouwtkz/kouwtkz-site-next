"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Post } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import isStatic from "@/app/components/System/isStatic.mjs";
import PostButton from "../../PostButton";
import { usePostTargetState } from "../../PostTargetState";

type PostDetailProps = {
  post?: Post;
};

const TopPage = ({ post }: PostDetailProps) => {
  const { postTarget, setPostTarget } = usePostTargetState();
  useEffect(() => {
    if (!post) {
      if (postTarget !== null) setPostTarget();
    } else if (!postTarget || postTarget.id !== post.id) setPostTarget(post);
  });
  if (!post) return null;
  return (
    <>
      {!isStatic ? <PostButton /> : null}
      <div className="text-lg">
        <Link href="/blog">
          <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
            MINI BLOG
          </h2>
        </Link>
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          <div>
            <MultiParser twemoji={true}>
              <h1 className="text-4xl text-main-deep font-bold mx-2 my-4 inline-block">
                {post.title}
              </h1>
            </MultiParser>
            <span className="mx-3 underline">
              <Link href={`/blog/?q=%23${post.category}`}>{post.category}</Link>
            </span>
          </div>
          <MultiParser
            all={true}
            className="[&_p]:my-4 [&_p]:whitespace-pre-line"
          >
            {post.body}
          </MultiParser>
        </div>
      </div>
    </>
  );
};

export default TopPage;

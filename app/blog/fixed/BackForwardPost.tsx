"use client";

import React, { HTMLAttributes, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "../Post";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface BackForwardPostProps extends HTMLAttributes<HTMLDivElement> {
  postId: string;
  posts: Post[];
}

export default function BackForwardPost({
  postId,
  posts,
  className,
  ...args
}: BackForwardPostProps) {
  const router = useRouter();
  className = className ? ` ${className}` : "";
  const postIndex = posts.findIndex((post) => post.postId === postId);
  const beforePost = posts[postIndex - 1];
  const afterPost = posts[postIndex + 1];

  // const _min = 1;
  // const _max = max || 1;
  // const before;

  return (
    <div {...args} className={"flex flex-row" + className}>
      <button
        type="button"
        className={
          "mx-2 my-3 w-10 h-10 p-0 text-xl rounded-full bg-main-soft hover:bg-main-pale" +
          (!beforePost ? " opacity-40" : "")
        }
        disabled={!beforePost}
        title={beforePost?.title || ""}
        onClick={() => {
          router.push(`?postId=${beforePost.postId}`);
        }}
      >
        <AiFillCaretLeft className="fill-white w-8 h-8 my-1 mx-[0.15rem]" />
      </button>
      <button
        type="button"
        className={
          "mx-2 my-3 w-10 h-10 text-xl rounded-full p-0 bg-main-soft hover:bg-main-pale" +
          (!afterPost ? " opacity-40" : "")
        }
        disabled={!afterPost}
        title={afterPost?.title || ""}
        onClick={() => {
          router.push(`?postId=${afterPost.postId}`);
        }}
      >
        <AiFillCaretRight className="fill-white w-8 h-8 my-1 mx-[0.35rem]" />
      </button>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import OnePost from "./OnePost";
import Fixed from "./PostsPageFixed";
import Link from "next/link";
import getPosts from "./functions/getPosts";
import { Post } from "./Post";

type PostsPageProps = {
  posts: Post[];
  update?: boolean;
  take?: number;
  page?: number;
  q?: string;
  common?: boolean;
  pinned?: boolean;
};

export default function PostsPage({
  posts,
  update = false,
  take,
  page,
  common,
  q = "",
  pinned = false,
}: PostsPageProps) {
  if (posts.length === 0) return <></>;
  const {
    posts: postsResult,
    max,
    count,
  } = getPosts({
    posts,
    page,
    q,
    take: 5,
    common: process.env.NODE_ENV !== "development",
  });

  return (
    <>
      <Fixed isStatic={true} max={max} />
      <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
        {postsResult.length > 0 ? (
          <>
            {postsResult.map((post, index) => (
              <OnePost post={post} isStatic={true} key={index} />
            ))}
            {max > 1 && (page || 1) < max ? (
              <div className="text-center">
                <Link
                  className="inline-block mt-4 mb-2 text-xl"
                  href={`/blog?${Object.entries({
                    p: String((page || 1) + 1),
                    q: q,
                  })
                    .filter((v) => v[1])
                    .map((v) => v.join("="))
                    .join("&")}`}
                >
                  次のページ ▽
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center">投稿はありません</div>
        )}
      </div>
    </>
  );
}

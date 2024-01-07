"use client";

import OnePost from "./OnePost";
import { usePostState } from "./PostState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PostDetail from "./PostDetail";
import { findMany } from "./functions/findMany";
import getPosts from "./functions/getPosts";
import Fixed from "./fixed/PostsPageFixed";

export default function PostsPage({ isStatic }: { isStatic: boolean }) {
  const { posts } = usePostState();
  const search = useSearchParams();

  const page = Number(search.get("p") || 1);
  const q = search.get("q") || undefined;
  const postId = search.get("postId") || undefined;
  if (postId) {
    return (
      <PostDetail
        post={findMany({ list: posts, where: { postId }, take: 1 })[0]}
      />
    );
  } else {
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
      common: isStatic,
    });
    return (
      <>
        <Fixed isStatic={isStatic} max={max} />
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          {postsResult.length > 0 ? (
            <>
              {postsResult.map((post, index) => (
                <OnePost post={post} isStatic={isStatic} key={index} />
              ))}
              {max > 1 && (page || 1) < max ? (
                <div className="text-center">
                  <Link
                    className="inline-block mt-4 mb-2 text-xl"
                    href={`/blog?${Object.entries({
                      q: q?.replace("#", "%23").replace("+", "%2B"),
                      p: String((page || 1) + 1),
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
}

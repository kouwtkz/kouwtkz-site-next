"use client";

import OnePost from "./OnePost";
import { usePostState } from "./PostState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findMany } from "./functions/findMany.mjs";
import getPosts from "./functions/getPosts.mjs";
import PostsPageFixed from "./fixed/PostsPageFixed";
import PostDetailFixed from "./fixed/PostDetailFixed";
import { useServerState } from "../components/System/ServerState";
import { getLocalDraft, useLocalDraftPost } from "./post/postLocalDraft";
import { useEffect, useMemo } from "react";

export default function PostsPage() {
  const { posts } = usePostState();
  const search = useSearchParams();
  const { isServerMode } = useServerState();
  const page = Number(search.get("p") || 1);
  const q = search.get("q") || undefined;
  const postId = search.get("postId") || undefined;
  const take = postId ? undefined : 10;
  const { localDraft, setLocalDraft } = useLocalDraftPost();

  useEffect(() => {
    if (!isServerMode) return;
    const item = getLocalDraft();
    if (item) setLocalDraft(item);
  }, [isServerMode, setLocalDraft]);

  const {
    posts: postsResult,
    max,
    count,
  } = useMemo(() => {
    const result = getPosts({
      posts,
      page,
      q,
      take,
      common: !isServerMode,
    });
    result.posts.sort((a, b) => (b.pin || 0) - (a.pin || 0));
    return result;
  }, [isServerMode, page, posts, q, take]);

  if (postId) {
    return (
      <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
        <PostDetailFixed postId={postId} posts={postsResult} />
        <OnePost
          post={findMany({ list: posts, where: { postId }, take: 1 })[0]}
          detail={true}
        />
      </div>
    );
  } else {
    if (posts.length === 0) return <></>;
    return (
      <>
        <PostsPageFixed max={max} />
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          {localDraft ? (
            <OnePost post={{ ...localDraft, pin: 0xffff }} />
          ) : null}
          {postsResult.length > 0 ? (
            <>
              {postsResult.map((post, index) => (
                <OnePost post={post} key={index} />
              ))}
              {max > 1 && (page || 1) < max ? (
                <div className="text-center">
                  <Link
                    className="inline-block mt-4 mb-2 text-xl"
                    href={{
                      pathname: "/blog",
                      query: {
                        ...(q ? { q } : {}),
                        p: (page || 1) + 1,
                      },
                    }}
                    prefetch={false}
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

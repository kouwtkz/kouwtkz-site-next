"use client";

import OnePost from "./OnePost";
import { usePostState } from "./PostState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findMany } from "./functions/findMany.mjs";
import getPosts from "./functions/getPosts.mjs";
import PostsPageFixed from "./fixed/PostsPageFixed";
import PostDetailFixed from "./fixed/PostDetailFixed";
import { useServerState } from "../context/system/ServerState";
import { getLocalDraft, useLocalDraftPost } from "./post/postLocalDraft";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { TbRss } from "react-icons/tb";
import type { UrlObject } from "url";
import { queryCheck, useBreakcrumb } from "../components/navigation/breadcrumb";
import { MdClientNode } from "../context/md/MarkdownDataClient";

export function BlogPage({
  blogEnable,
}: {
  title?: string;
  blogEnable?: boolean;
}) {
  const { setBackUrl } = useBreakcrumb();
  const search = useSearchParams();
  const p = search.get("p") || undefined;
  const q = search.get("q") || undefined;
  const postId = search.get("postId") || undefined;
  const postpageQuery = { p, q, postId };
  const { queryEnable, queryJoin } = queryCheck({
    query: postpageQuery,
  });
  const arc = "archive";
  const blogShowMode =
    blogEnable || Boolean(search.get("show") === arc) || queryEnable;
  const arcEnable1 = !blogEnable && queryEnable;
  useEffect(() => {
    if (arcEnable1 && queryJoin) setBackUrl({ query: { show: arc } });
  }, [arcEnable1, queryJoin, setBackUrl]);
  const blogTopLink: UrlObject = { pathname: "/blog" };
  if (arcEnable1 && queryJoin) {
    blogTopLink.query = { show: arc };
  }
  return (
    <>
      <div className="mt-6 pt-8 mb-12 flex justify-center items-baseline align-text-bottom">
        <Link href={blogTopLink} className="inline-block" title="ブログトップ">
          <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main">
            MINI BLOG
          </h2>
        </Link>
        {blogEnable ? (
          <Link
            title="RSSフィード"
            className="inline-block text-lg ml-3 sm:text-xl sm:ml-4"
            target="_blank"
            href="/blog/rss.xml"
            prefetch={false}
          >
            <TbRss />
          </Link>
        ) : null}
      </div>
      {blogShowMode ? (
        <PostsPage {...postpageQuery} />
      ) : (
        <>
          <h2 className="my-4">このブログは更新停止しました！</h2>
          <div className="my-4 flex flex-col items-center">
            <MdClientNode
              name="info/linkBlog.md"
              className="mx-2 [&_ul]:text-left flex flex-col max-w-2xl"
            />
          </div>
          <h4 className="my-8">
            ブログのアーカイブは
            <Link href={{ query: { show: arc } }} prefetch={false}>
              こちら
            </Link>
          </h4>
        </>
      )}
    </>
  );
}

export function PostsPage({
  p = "1",
  q,
  postId,
}: {
  p?: string;
  q?: string;
  postId?: string;
}) {
  const { isSetCheck, isSet: postsIsSet } = usePostState();
  useLayoutEffect(() => {
    isSetCheck();
  }, [isSetCheck]);
  const page = Number(p);
  const { posts } = usePostState();
  const { isServerMode } = useServerState();
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
          ) : postsIsSet ? (
            <div className="text-center">投稿はありません</div>
          ) : (
            <div className="text-center">よみこみちゅう…</div>
          )}
        </div>
      </>
    );
  }
}

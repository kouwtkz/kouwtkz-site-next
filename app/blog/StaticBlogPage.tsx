"use client";

import { Suspense } from "react";
import OnePost from "./OnePost";
import { usePostState } from "./PostState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PostsPage from "./PostsPage";
import PostDetail from "./PostDetail";
import { findMany } from "./functions/findMany";

export default function Main() {
  return (
    <Suspense>
      <StaticBlogPage />
    </Suspense>
  );
}

function StaticBlogPage() {
  const { posts } = usePostState();
  const search = useSearchParams();

  const page = Number(search.get("p") || 1);
  const q = search.get("q") || undefined;
  const postId = search.get("postId") || undefined;
  if (postId) {
    return (
      <PostDetail post={findMany({ list: posts, where: { postId }, take: 1 })[0]} />
    );
  } else {
    return <PostsPage posts={posts} page={page} q={q} />;
  }
}

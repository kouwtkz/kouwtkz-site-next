import React from "react";
import getPostDetail from "@/app/api/blog/getPostDetail";
import getPosts from "@/app/api/blog/getPosts";
import PostDetail from "./postDetail";

export default async function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { postId } = params;
  const post = await getPostDetail({ postId });
  if (!post) return <></>;
  return <PostDetail post={post} />;
}

export async function generateStaticParams() {
  const posts = await getPosts({ max: 0xffff });
  const v = Object.values(posts).map((post) => {
    return { postId: post.postId };
  });
  return v;
}

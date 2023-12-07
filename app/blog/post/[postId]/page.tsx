import React from "react";
import getPostDetail from "../../functions/getPostDetail";
import getPosts from "../../functions/getPosts";
import PostDetail from "./PostDetail";

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

async function generateStaticParams() {
  const posts = await getPosts({ max: 0xffff });
  const v = Object.values(posts).map((post) => {
    return { postId: post.postId };
  });
  return v;
}
export { generateStaticParams }

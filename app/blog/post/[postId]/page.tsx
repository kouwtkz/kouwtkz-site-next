import React from "react";
import getPostDetail from "../../functions/getPostDetail";
import getPosts from "../../functions/getPosts";
import PostDetail from "./PostDetail";
import PostButton from "../../PostButton";
import isStatic from "@/app/components/System/isStatic.mjs";
import LikeButton from "@/app/components/button/LikeButton";

// ↓ 静的ビルドする際のみコメントアウトを外すこと
// export { generateStaticParams };
async function generateStaticParams() {
  const posts = await getPosts({ max: 0xffff });
  return Object.values(posts).map((post) => {
    return { postId: post.postId };
  });
}

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
  return (
    <>
      {!isStatic ? <PostButton postId={postId} /> : null}
      {!isStatic ? <LikeButton /> : null}
      <PostDetail post={post} />
    </>
  );
}

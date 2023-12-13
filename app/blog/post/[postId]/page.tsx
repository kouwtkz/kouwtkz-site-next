import React from "react";
import getPostDetail from "../../functions/getPostDetail";
import getPosts from "../../functions/getPosts";
import PostDetail from "./client";
import isStatic from "@/app/components/System/isStatic.mjs";
import Fixed from "./Fixed";
import getCurrentUser from "@/app/actions/getCurrentUser";

// ↓ 静的ビルドする際のみコメントアウトを外すこと
// export { generateStaticParams };
async function generateStaticParams() {
  const { posts } = await getPosts({ take: 0xffff });
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
  const currentUser = await getCurrentUser();
  const { postId } = params;
  const post = await getPostDetail({ postId });
  if (!post) return <></>;
  return (
    <>
      <Fixed isStatic={isStatic} postId={postId} currentUser={currentUser} />
      <PostDetail post={post} />
    </>
  );
}

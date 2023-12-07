import isStatic from "@/app/components/System/isStatic.mjs";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import PostForm from "./PostForm";
import getPostDetail from "../functions/getPostDetail";

export default async function postPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  if (isStatic) redirect(`/blog`);
  const targetPostId =
    !isStatic && searchParams.target ? searchParams.target : undefined;
  const targetPost = targetPostId
    ? await getPostDetail({ postId: targetPostId })
    : null;
  const CategoryCount = await prisma.post.groupBy({
    by: ["category"],
    _count: {
      _all: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
  });
  return (
    <PostForm
      categoryCount={CategoryCount.map((r) => ({
        category: String(r.category),
        count: r._count._all,
      }))}
      postTarget={targetPost}
    />
  );
}

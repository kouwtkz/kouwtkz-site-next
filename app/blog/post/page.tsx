import isStatic from "@/app/components/System/isStatic.mjs";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import PostForm from "./PostForm";
import getPostDetail from "../functions/getPostDetail";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { headers } from "next/headers";

type ParamsType = { [key: string]: string | undefined };
export default async function postPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: ParamsType;
}) {
  const currentUser = await getCurrentUser();
  if (!isStatic) {
    const headersList = headers();
    if (!currentUser) {
      const redirectUrl = new URL(headersList.get("x-url") || "");
      redirect(
        `/setting/login?redirect=${redirectUrl.pathname + redirectUrl.search}`
      );
    }
  }

  const _searchParams: ParamsType = isStatic ? {} : searchParams;
  const targetPostId = _searchParams.target || _searchParams.base;
  const targetPost = targetPostId
    ? await getPostDetail({ postId: targetPostId })
    : null;
  const CategoryCount = await prisma.post.groupBy({
    by: ["category"],
    where: { category: { not: "" } },
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
    <>
      <PostForm
        categoryCount={CategoryCount.map((r) => ({
          category: String(r.category),
          count: r._count._all,
        }))}
        postTarget={targetPost}
        mode={{ duplication: Boolean(_searchParams.base) }}
      />
    </>
  );
}

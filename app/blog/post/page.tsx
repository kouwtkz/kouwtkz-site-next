import isStatic from "@/app/components/System/isStatic.mjs";
const prisma: any = {};
import PostForm from "./PostForm";
import getPostDetail from "../functions/getPostDetail";
import PostState from "../PostState";

type ParamsType = { [key: string]: string | undefined };
export default async function postPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: ParamsType;
}) {
  const _searchParams: ParamsType = isStatic ? {} : searchParams;
  const targetPostId = _searchParams.target || _searchParams.base;
  const targetPost = targetPostId
    ? await getPostDetail({ postId: targetPostId })
    : null;
  // 後で互換性のある関数にする
  const CategoryCount = [{ category: "", _count: { _all: 1 } }];
  // const CategoryCount = await prisma.post.groupBy({
  //   by: ["category"],
  //   where: { category: { not: "" } },
  //   _count: {
  //     _all: true,
  //   },
  //   orderBy: {
  //     _count: {
  //       category: "desc",
  //     },
  //   },
  // });
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

import prisma from "@/app/lib/prisma";
import TopPage from "@/app/TopPage";
import { isStatic } from "@/app/components/System/ServerDataMake";

// export const dynamicParams = true;
export const dynamic = isStatic ? "auto" : "force-dynamic";

export default async function Page() {
  const topPosts = await prisma.post.findMany({
    select: {
      postId: true,
      title: true,
      date: true,
    },
    where: {
      category: "お知らせ",
    },
    orderBy: {
      date: "desc",
    },
    take: 3,
  });
  return (
    <>
      <TopPage topPosts={topPosts} />
    </>
  );
}

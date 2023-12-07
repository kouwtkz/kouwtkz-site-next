import prisma from "@/app/lib/prisma";
import TopPage from "@/app/TopPage";
import isStatic from "@/app/components/System/isStatic.mjs";
import { getImageItem } from "@/app/media/image/MediaImageData.mjs";

// export const dynamicParams = true;
export const dynamic = isStatic ? "auto" : "force-dynamic";

export default async function Page() {
  const topImage = getImageItem({ filter: { topImage: true } });
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
      <TopPage topImage={topImage} topPosts={topPosts} />
    </>
  );
}

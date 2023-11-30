import prisma from "@/app/lib/prisma";
import TopPage from "@/app/TopPage";
import { isStatic } from "@/app/functions/general";
import { getImageItem } from "@/media/scripts/MediaImageData.mjs";

export default async function Page() {
  const topPosts = await prisma.post.findMany({
    where: {
      category: "お知らせ",
    },
    orderBy: {
      date: "desc"
    },
    take: 3
  });
  return (
    <>
      <TopPage
        isStatic={isStatic}
        topImage={getImageItem({filter: {topImage: true}})}
        topPosts={topPosts}
      />
    </>
  );
}

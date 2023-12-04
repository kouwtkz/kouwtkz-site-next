import prisma from "@/app/lib/prisma";
import TopPage from "@/app/TopPage";
import { isStatic } from "@/app/functions/general";
import { getImageItem } from "@/app/media/MediaImageData.mjs";

// export const dynamicParams = true;
export const dynamic = isStatic ? "auto" : "force-dynamic";

export default async function Page() {
  const topPosts = await prisma.post.findMany({
    where: {
      category: "お知らせ",
    },
    orderBy: {
      date: "desc",
    },
    take: 3,
  });
  const topImage = getImageItem({ filter: { topImage: true } });
  return (
    <>
      <TopPage isStatic={isStatic} topImage={topImage} topPosts={topPosts} />
    </>
  );
}

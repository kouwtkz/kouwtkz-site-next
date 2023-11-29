import prisma from "@/app/lib/prisma";
import TopPage from "@/app/TopPage";
import { isStatic } from "@/siteData/site";
import { imageList } from "@/media/scripts/MediaData";

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
        topImage={imageList.find((image) => image.topImage)}
        topPosts={topPosts}
      />
    </>
  );
}

const prisma: any = {};
import TopPage from "@/app/TopPage";
import { getImageItem } from "@/app/media/image/MediaImageData.mjs";

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";
// export const dynamicParams = true;

export default async function Page() {
  // const topImage = getImageItem({ filter: { topImage: true } });
  return (
    <>
      <TopPage />
    </>
  );
}

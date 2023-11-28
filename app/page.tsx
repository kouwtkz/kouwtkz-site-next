import TopPage from "@/app/components/client/TopPage";
import { isStatic } from "@/siteData/site";
import { imageList } from "@/media/scripts/MediaData";

export default function Page() {
  return (
    <>
      <TopPage
        isStatic={isStatic}
        topImage={imageList.find((image) => image.topImage)}
      />
    </>
  );
}

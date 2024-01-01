import { Metadata } from "next";
import GalleryPage from "../GalleryPage";
const title = "GIVEN FANART";
export const metadata: Metadata = { title };

export default function page() {
  return (
    <div className="pt-8">
      <h2 className="my-4 text-4xl text-main font-MochiyPopOne">
        描いてくれてありがとめぇ！
      </h2>
      <h4 className="text-main-soft">#わたかぜメ絵</h4>
      <GalleryPage
        items={"given"}
        max={40}
        step={28}
        label="given fanart"
        link={false}
        filterButton={true}
      />
    </div>
  );
}

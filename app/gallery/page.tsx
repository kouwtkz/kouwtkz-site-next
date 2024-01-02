import { Metadata } from "next";
import GalleryObject from "./GalleryObject";
const title = "GALLERY";
export const metadata: Metadata = { title };
import { site } from "@/app/site/SiteData.mjs";

export default function page() {
  return <GalleryObject items={site.gallery?.default} />;
}

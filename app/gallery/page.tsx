import { Metadata } from "next";
import GalleryPage from "./GalleryPage";
const title = "GALLERY";
export const metadata: Metadata = { title };

export default function page() {
  return <GalleryPage />;
}

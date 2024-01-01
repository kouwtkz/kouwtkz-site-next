import { Metadata } from "next";
import GalleryPage from "./GalleryPage";
const title = "GALLERY";
export const metadata: Metadata = { title };

export default function page() {
  return (
    <>
      <GalleryPage
        items={[
          "art",
          { name: "fanart", max: 12 },
          "works",
          {
            name: "comics",
            label: "fanbook",
            match: "fanbook",
            format: "comic",
          },
          {
            name: "given",
            label: "given fanart",
          },
        ]}
      />
    </>
  );
}

import { soundData } from "@/media/scripts/MediaData";
import SoundPage from "./client";

export default async function Page() {
  return (
    <>
      <SoundPage soundData={soundData} />
    </>
  );
}

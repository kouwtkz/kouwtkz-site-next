import { soundAlbums } from "@/media/scripts/MediaSoundData.mjs";
import SoundPage from "./client";

export default async function Page() {
  return (
    <>
      {soundAlbums.map((album, i) => {
        {
          <SoundPage key={i} soundAlbum={album} />;
        }
      })}
    </>
  );
}

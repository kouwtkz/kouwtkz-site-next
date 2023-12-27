import { soundAlbums } from "./MediaSoundData.mjs";
import SoundPage from "./client";
const soundAlbum = soundAlbums.find(album => album.name === "sound") || null;

export default async function Page() {
  return (
    <>
      <SoundPage soundAlbum={soundAlbum} />
    </>
  );
}

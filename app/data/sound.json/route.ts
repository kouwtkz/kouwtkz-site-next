import { NextResponse } from "next/server"
import { soundAlbums } from "@/app/sound/MediaSoundData.mjs";
const soundAlbum = soundAlbums.find(album => album.name === "sound") || null;

export async function GET() {
  return NextResponse.json(soundAlbum);
}
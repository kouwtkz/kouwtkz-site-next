import { NextResponse } from "next/server"
import { soundAlbum } from "@/app/sound/MediaSoundData.mjs";

export async function GET() {
  return NextResponse.json(soundAlbum);
}

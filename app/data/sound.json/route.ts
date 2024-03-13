import { NextResponse } from "next/server"

import isStatic from "@/app/context/system/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { soundAlbum } from "@/app/sound/MediaSoundData.mjs";

export async function GET() {
  return NextResponse.json(soundAlbum);
}

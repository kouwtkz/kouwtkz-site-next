import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { soundAlbum } from "@/app/sound/MediaSoundData.mjs";

export async function GET() {
  return NextResponse.json(soundAlbum);
}

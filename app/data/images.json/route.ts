import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";

import { GetMediaImageAlbums } from "@/mediaScripts/YamlImageFunctions.mjs";

export async function GET() {
  const albums = await GetMediaImageAlbums({ ...fromto, readSize: true, filter: { archive: false } });
  return NextResponse.json(albums);
}
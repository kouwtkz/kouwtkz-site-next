import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";

import { GetMediaImageAlbums } from "@/mediaScripts/YamlImageFunctions.mjs";

export async function GET() {
  const albums = await GetMediaImageAlbums({ ...fromto, filter: { archive: false } });
  return NextResponse.json(albums);
}
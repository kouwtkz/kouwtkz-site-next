import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { GetMediaImageAlbums } from "@/mediaScripts/YamlImageFunctions.mjs";

export async function GET() {
  const albums = GetMediaImageAlbums({from: "_data/_media", to: "_media", filter: {archive: false}});
  return NextResponse.json(albums);
}
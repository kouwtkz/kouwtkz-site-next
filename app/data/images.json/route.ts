import { NextResponse } from "next/server"
import { GetMediaImageAlbums } from "@/imageScripts/YamlImageFunctions.mjs";

export async function GET() {
  const albums = GetMediaImageAlbums({path: "_media", filter: {archive: false}});
  return NextResponse.json(albums);
}
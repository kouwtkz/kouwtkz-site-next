import { NextResponse } from "next/server"
import { GetMediaImageAlbums } from "@/MediaScripts/YamlImageFunctions.mjs";

export async function GET() {
  const albums = GetMediaImageAlbums({from: "_data/_media", to: "_media", filter: {archive: false}});
  return NextResponse.json(albums);
}
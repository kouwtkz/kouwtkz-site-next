import { NextResponse } from "next/server"
import { getImageAlbums } from "@/imageScripts/MediaImageData.mjs";

export async function GET() {
  const albums = getImageAlbums();
  return NextResponse.json(albums);
}
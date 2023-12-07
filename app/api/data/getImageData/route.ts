import { NextResponse } from "next/server"
import { getImageAlbums } from "@/app/media/MediaImageData.mjs";

export async function GET() {
  const albums = getImageAlbums();
  return NextResponse.json(albums);
}
import { NextResponse } from "next/server"
import { getImageAlbums } from "@/app/media/image/MediaImageData.mjs";

export async function GET() {
  const albums = getImageAlbums();
  return NextResponse.json(albums);
}
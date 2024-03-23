import { NextResponse } from "next/server"
import { ReadImageFromYamls } from "@/mediaScripts/ReadImage.mjs"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";

import { GetMediaImageAlbums } from "@/mediaScripts/GetImageList.mjs";

export async function GET() {
  const albums = await GetMediaImageAlbums({ ...fromto, readImageHandle: ReadImageFromYamls, filter: { archive: false } });
  return NextResponse.json(albums);
}
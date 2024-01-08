import { NextResponse } from "next/server"

import { charaObject } from "@/app/character/getCharaData.mjs";

export async function GET() {
  return NextResponse.json(charaObject);
}

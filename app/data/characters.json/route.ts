import { NextResponse } from "next/server"

import { charaObject } from "@/app/character/getCharaData";

export async function GET() {
  return NextResponse.json(charaObject);
}

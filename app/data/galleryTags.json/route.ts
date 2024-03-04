import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { charaObject } from "@/app/character/CharaDataFunction.mjs";

export async function GET() {
  return NextResponse.json(charaObject);
}

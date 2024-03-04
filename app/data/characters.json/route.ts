import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { getCharaObjectFromYaml } from "@/app/character/CharaDataFunction.mjs";

export async function GET() {
  return NextResponse.json(getCharaObjectFromYaml());
}

import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { getCharaObjectFromYaml } from "@/app/character/CharaDataFunction.mjs";

export async function GET() {
  return NextResponse.json(getCharaObjectFromYaml());
}

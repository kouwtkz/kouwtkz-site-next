import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { GetEmbed } from "@/app/context/embed/GetEmbed.mjs"

export async function GET() {
  return NextResponse.json(GetEmbed());
}

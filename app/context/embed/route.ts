import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { GetEmbed } from "@/app/context/embed/GetEmbed.mjs"

export async function GET() {
  const isServerMode = !(isStatic && process.env.NODE_ENV === "production");
  if (isServerMode) return NextResponse.json(GetEmbed());
  else return NextResponse.json([]);
}

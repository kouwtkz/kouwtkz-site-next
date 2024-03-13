import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { MarkdownDataObject } from "@/app/context/md/MarkdownData.mjs";

export async function GET() {
  return NextResponse.json(MarkdownDataObject("client"));
}

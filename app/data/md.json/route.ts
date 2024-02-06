import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { MarkdownDataObject } from "@/app/context/md/MarkdownData.mjs";

export async function GET() {
  return NextResponse.json(MarkdownDataObject("client"));
}
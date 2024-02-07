import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { getSiteData } from "@/app/context/site/SiteData.mjs";

export async function GET() {
  return NextResponse.json(getSiteData());
}

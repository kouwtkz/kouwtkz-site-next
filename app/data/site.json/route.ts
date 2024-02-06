import { NextResponse } from "next/server"

import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { site } from "@/app/context/site/SiteData.mjs";

export async function GET() {
  return NextResponse.json(site);
}

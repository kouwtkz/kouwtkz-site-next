import { NextResponse } from "next/server"

const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

import { getSiteData } from "@/app/context/site/SiteData.mjs";

export async function GET() {
  return NextResponse.json(getSiteData());
}

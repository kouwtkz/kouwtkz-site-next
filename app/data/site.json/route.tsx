import { NextResponse } from "next/server"

import { site } from "@/app/site/SiteData.mjs";

export async function GET() {
  return NextResponse.json(site);
}

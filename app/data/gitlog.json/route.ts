import { NextResponse } from "next/server";
import { getGitLog } from "@/app/context/git/log.mjs";

export async function GET() {
  return NextResponse.json(getGitLog());
}

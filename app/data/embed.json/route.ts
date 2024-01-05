import { NextResponse } from "next/server"
import GetEmbed from "@/app/context/embed/GetEmbed.mjs"

export async function GET() {
  return NextResponse.json(GetEmbed());
}

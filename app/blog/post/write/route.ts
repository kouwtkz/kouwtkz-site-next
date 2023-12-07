import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json("GET");
}
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData.entries());
  return NextResponse.json(["POST", form]);
} 
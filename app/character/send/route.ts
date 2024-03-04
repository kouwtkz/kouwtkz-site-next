import { NextRequest } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { resolve } from "path";
import { mkdirSync, renameSync, unlinkSync } from "fs";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });
  const formData = await req.formData();
  formData.forEach((value, key) => {
    console.log({key, value});
  })
  return new Response("");
}

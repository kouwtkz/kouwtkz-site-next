import { NextRequest } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { uploadAttached } from "./uploadAttached";

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });

  const formData = await req.formData();
  uploadAttached({
    attached: (formData.getAll("attached[]") || []) as File[],
    attached_mtime: formData.getAll("attached_mtime[]") || [],
    uploadDir: String(formData.get("dir")) || "images/uploads"
  })
  return new Response("");
}
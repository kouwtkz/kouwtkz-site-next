import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";
import { readFileSync, existsSync } from "fs";
import { contentType } from "mime-types"
import { NextRequest } from "next/server";
import { extname, resolve } from "path";
const ROOT = process.env.ROOT || "";

function notfoundResponse() {
  return new Response("file not found", {
    headers: {
      "Content-Type": "text/plain",
    },
    status: 404
  });
}

export async function GET(req: NextRequest) {
  const pathname = decodeURI(req.nextUrl.pathname);
  try {
    let filePath = resolve(`${ROOT}/public${pathname}`);
    if (!existsSync(filePath)) {
      filePath = resolve(`${ROOT}/_data${pathname}`);
      if (!existsSync(filePath)) return notfoundResponse();
    }
    const file = readFileSync(filePath)
    return new Response(file, {
      headers: {
        "Content-Type": contentType(extname(pathname)) || "application/octet-stream",
      }
    });
  } catch (e) {
    console.error(e);
    return notfoundResponse();
  }
}

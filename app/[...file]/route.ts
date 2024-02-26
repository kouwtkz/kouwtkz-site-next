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
  let pathname = decodeURI(req.nextUrl.pathname);
  try {
    let filePath =
      [`${ROOT}/public${pathname}`, `${ROOT}/_data${pathname}`, `${ROOT}/_data/_media${pathname}`]
        .find(path => existsSync(path));
    if (!filePath) return notfoundResponse();
    const file = readFileSync(resolve(filePath))
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

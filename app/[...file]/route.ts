import isStatic from "@/app/context/system/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";
import { NextRequest } from "next/server";
import { dataResponse } from "../context/system/ServerFunction";

export async function GET(req: NextRequest) {
  return dataResponse(decodeURI(req.nextUrl.pathname));
}

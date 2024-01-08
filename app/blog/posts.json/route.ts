import { NextResponse } from "next/server"
import getPosts from "../functions/getPosts.mjs";
import { getPostsFromJson } from "./fromJson.mjs";
import isStatic from "@/app/components/System/isStatic.mjs";
export const dynamic = isStatic ? "auto" : "force-dynamic";

export async function GET() {
  try {
    const posts = getPostsFromJson();
    const { posts: result } = getPosts({ posts, common: isStatic && process.env.NODE_ENV === "production" })
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
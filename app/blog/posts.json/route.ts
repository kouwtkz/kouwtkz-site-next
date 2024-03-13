import { NextResponse } from "next/server"
import getPosts from "../functions/getPosts.mjs";
import { getPostsFromYaml } from "./postDataFunction.mjs";
const isStatic = process.env.OUTPUT_MODE === "export";
export const dynamic = isStatic ? "auto" : "force-dynamic";

export async function GET() {
  try {
    const posts = getPostsFromYaml();
    const { posts: result } = getPosts({ posts, common: isStatic && process.env.NODE_ENV === "production" })
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
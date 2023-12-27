import { NextResponse } from "next/server"
import getPosts from "../functions/getPosts";
import { getPostsFromJson } from "./fromJson";

export async function GET() {
  try {
    const posts = getPostsFromJson();
    const { posts: result } = getPosts({ posts, common: process.env.NODE_ENV !== "development" })
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
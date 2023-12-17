import { NextResponse } from "next/server"
import fs from "fs";
import getPosts from "../functions/getPosts";

export async function GET() {
  try {
    const cwd = process.cwd();
    const posts = JSON.parse(String(fs.readFileSync(`${cwd}/_data/post.json`)));
    const { posts: result } = getPosts({ posts, common: process.env.NODE_ENV !== "development" })
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
import { NextResponse } from "next/server"
import fs from "fs";
import getPosts from "../functions/getPosts";
import { Post } from "../Post";

export async function GET() {
  try {
    const cwd = process.cwd();
    const posts: Post[] = JSON.parse(String(fs.readFileSync(`${cwd}/_data/post.json`)));
    posts.forEach(post => { post.date = new Date(post.date); post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null; })
    const { posts: result } = getPosts({ posts, common: process.env.NODE_ENV !== "development" })
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
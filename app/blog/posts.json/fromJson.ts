import { readFileSync, writeFileSync } from "fs";
import { Post } from "../Post";
const cwd = process.cwd();
const postJsonUrl = "/_data/post.json";
const postJsonPath = `${cwd}${postJsonUrl}`

export function getPostsFromJson() {
  const posts = (JSON.parse(String(readFileSync(postJsonPath))) as Post[]).filter(post => post);
  posts.forEach(post => { post.date = new Date(post.date); post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null; })
  return posts;
}

export function setPostsToJson(posts: Post[]) {
  return writeFileSync(postJsonPath, JSON.stringify(posts));
}

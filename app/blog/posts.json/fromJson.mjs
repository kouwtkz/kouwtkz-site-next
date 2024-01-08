// @ts-check

/** @typedef { import("../Post.d").Post } Post */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
const postJsonUrl = "/_data/post.json";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const postJsonPath = resolve(`${cwd}/${postJsonUrl}`)

export function getPostsFromJson() {
  /** @type {Post[]} rawPosts */
  const rawPosts = JSON.parse(String(readFileSync(postJsonPath)))
  const posts = rawPosts.filter(post => post);
  posts.forEach(post => { post.date = new Date(post.date); post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null; })
  return posts;
}

/** @param {Post[]} posts  */
export function setPostsToJson(posts) {
  return writeFileSync(postJsonPath, JSON.stringify(posts, null, "\t"));
}

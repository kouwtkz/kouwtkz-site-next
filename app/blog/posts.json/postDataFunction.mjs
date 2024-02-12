// @ts-check

/** @typedef { import("../Post").Post } Post */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

const postYamlPath = resolve(`${cwd}/_data/post.yaml`)
export function getPostsFromYaml() {
  /** @type {Post[]} rawPosts */
  const rawPosts = yamlParse(String(readFileSync(postYamlPath)))
  const posts = rawPosts.filter(post => post);
  posts.forEach(post => { post.date = new Date(post.date); post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null; })
  return posts;
}
/** @param {Post[]} posts  */
export function setPostsToYaml(posts) {
  posts.forEach((post) => { post.body = post.body.replace(/\r\n/g, "\n") });
  return writeFileSync(postYamlPath, yamlStringify(posts));
}

const postJsonPath = resolve(`${cwd}/_data/post.json`)
export function getPostsFromJson() {
  /** @type {Post[]} rawPosts */
  const rawPosts = JSON.parse(String(readFileSync(postJsonPath)))
  const posts = rawPosts.filter(post => post);
  posts.forEach(post => { post.date = new Date(post.date); post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null; })
  return posts;
}
/** @param {Post[]} posts  */
export function setPostsToJson(posts) {
  posts.forEach((post) => { post.body = post.body.replace(/\r\n/g, "\n") });
  return writeFileSync(postJsonPath, JSON.stringify(posts, null, "\t"));
}

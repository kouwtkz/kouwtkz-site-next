// @ts-check

import { statSync } from "fs";

export default function GetStateText() {
  const defaultMtime = GetDataMtime();
  const StateData =
    Object.fromEntries([
      ["/data/characters.json", "_data/characters.yaml"],
      ["/data/site.json", "_data/site.yaml"],
      "/data/images.json",
      ["/data/sound.json", "_data/sound/_data.yaml"],
      ["/blog/posts.json", "_data/post.json"]
    ].map(v => {
      if (Array.isArray(v)) {
        return [v[0], GetDataMtime(v[1])];
      } else {
        return [v, defaultMtime];
      }
    }));
  const data = { ...StateData };
  return Object.entries(data).map(
    ([key, value]) =>
      `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`
  ).join("\n")
}

/** @param {string | Date | undefined} file */
function GetDataMtime(file = undefined) {
  try {
    if (typeof file === "string") return Math.ceil(statSync(file).mtime.getTime() / 1000);
    else if (file) return Math.ceil(file.getTime() / 1000);
  } catch (e) {
    console.error(e);
  }
  return Math.ceil(new Date().getTime() / 1000);
}

// @ts-check
import { readdirSync } from "fs";
import { resolve } from "path";

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";

export function GetEmbed() {
  try {
    const root = resolve(`${cwd}/${dataDir}/embed`).replaceAll("\\", "/") + "/";
    return readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((item) => item.isFile())
      .map(item => item.path.replaceAll("\\", "/").replace(root, "") + "/" + item.name);
  } catch (e) { console.error(e) }
  return [];
}

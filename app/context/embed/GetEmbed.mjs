import { readFileSync } from "fs";
import { parse } from "yaml";

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";

export function GetEmbed() {
  let obj = {};
  try {
    obj = parse(String(readFileSync(`${cwd}/${dataDir}/embed.yaml`, "utf8")))
  } catch (e) { console.error(e) }
  return obj;
}

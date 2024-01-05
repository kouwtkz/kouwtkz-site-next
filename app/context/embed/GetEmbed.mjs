import { readFileSync } from "fs";
import { parse } from "yaml";
const yamlPath = "_data/embed.yaml";

export default function GetEmbed() {
  let obj = {};
  try {
    obj = parse(String(readFileSync(yamlPath)))
  } catch (e) { console.error(e) }
  return obj;
}

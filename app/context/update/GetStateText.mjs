// @ts-check

import { statSync } from "fs";
import updateDef from "@/app/data/updateDef.json";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

export default function GetStateText() {
  const defaultMtime = GetDataMtime();
  const StateData =
    Object.fromEntries(updateDef.map(v => {
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
    if (typeof file === "string") return Math.ceil(statSync(`${cwd}/${file}`).mtime.getTime() / 1000);
    else if (file) return Math.ceil(file.getTime() / 1000);
  } catch (e) {
    console.error(e);
  }
  return Math.ceil(new Date().getTime() / 1000);
}

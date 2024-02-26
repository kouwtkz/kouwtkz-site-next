// @ts-check

import { readFileSync, statSync } from "fs";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const updateDefPath = "app/context/start/updateDef.json";

/**
 * @typedef {{ [k: string]: { json: string, data: string | undefined } | undefined }} updateDefType
 */

/** @returns {updateDefType} */
export function GetUpdateDef() {
  return JSON.parse(String(readFileSync(updateDefPath)))
}

/** @param {updateDefType | undefined} updateDef */
export function GetStateText(updateDef = undefined) {
  const _updateDef = updateDef ? updateDef : GetUpdateDef();
  const defaultMtime = GetDataMtime();
  const StateData =
    Object.fromEntries(Object.values(_updateDef)
      .filter(v => v).map(v => {
        if (v?.data) {
          return [v.json, GetDataMtime(v.data)];
        } else {
          return [v?.json, defaultMtime];
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

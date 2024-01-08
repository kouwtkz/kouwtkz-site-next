// @ts-check

import { parse } from "yaml";
import { readFileSync } from "fs";
/** @typedef { import("./CharaType.d").CharaType } CharaType */
/** @typedef { import("./CharaType.d").CharaObjectType } CharaObjectType */

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";
/** @type any */
let rawData = {}
try {
  rawData = parse(readFileSync(`${cwd}/${dataDir}/characters.yaml`, "utf8"));
} catch { }

/** @type CharaObjectType */
export const charaObject = rawData;
/** @type Array<CharaType> */
export const charaList = Object.values(charaObject);
/** @type Map<string, CharaType> */
export const charaMap = new Map(Object.entries(charaObject));

Object.entries(charaObject).forEach(([key, chara]) => {
  chara.id = key;
});

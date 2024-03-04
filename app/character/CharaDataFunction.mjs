// @ts-check

/** @typedef { import("./CharaType.d").CharaType } CharaType */
/** @typedef { import("./CharaType.d").CharaObjectType } CharaObjectType */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";
const charaYamlPath = resolve(`${cwd}/${dataDir}/characters.yaml`)

/** @param {CharaObjectType} charaObject  */
function setCharaId(charaObject) {
  Object.entries(charaObject).forEach(([key, chara]) => {
    chara.id = key;
  });
}

export function getCharaObjectFromYaml(setId = true) {
  try {
    /** @type CharaObjectType */
    const rawData = yamlParse(readFileSync(charaYamlPath, "utf8"));
    if (setId) setCharaId(rawData);
    return rawData;
  } catch {
    return {};
  }
}

/** @param {CharaObjectType} charaObject  */
export function setCharaObjectToYaml(charaObject) {
  return writeFileSync(charaYamlPath, yamlStringify(charaObject));
}

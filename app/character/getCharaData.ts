import { parse } from "yaml";
import { readFileSync } from "fs";
import { CharaType, CharaObjectType } from "./CharaType";

const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;
const dataDir = process.env.DATA_DIR || "";
let rawData: any = {}
try {
  rawData = parse(readFileSync(`${cwd}/${dataDir}/characters.yaml`, "utf8"));
} catch { }

export const charaObject = <CharaObjectType>rawData;
export const charaList = <Array<CharaType>>Object.values(charaObject);
export const charaMap = <Map<string, CharaType>>new Map(Object.entries(charaObject));

Object.entries(charaObject).forEach(([key, chara]) => {
  chara.id = key;
});

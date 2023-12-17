import { parse } from "yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/components/functions/general";
import { CharaType, CharaObjectType } from "./chara.d";

const dataDir = `${process.env.DATA_DIR}`;
let rawData: any = {}
try {
  rawData = parse(readFileSync(setPath(`@/${dataDir}/characters.yaml`), "utf8"));
} catch { }

export const charaObject = <CharaObjectType>rawData;
export const charaList = <Array<CharaType>>Object.values(charaObject);
export const charaMap = <Map<string, CharaType>>new Map(Object.entries(charaObject));

Object.entries(charaObject).forEach(([key, chara]) => {
  chara.id = key;
});

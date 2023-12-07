import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/components/functions/general";
import { CharaType, CharaObjectType } from "./chara.d";

const dataDir = `${process.env.DATA_DIR}`;
const rawData = readFileSync(setPath(`@/${dataDir}/characters.yaml`), "utf8");

export const charaObject = <CharaObjectType>load(rawData);
export const charaList = <Array<CharaType>>Object.values(charaObject);
export const charaMap = <Map<string, CharaType>>new Map(Object.entries(charaObject));

Object.entries(charaObject).forEach(([key, chara]) => {
  chara.id = key;
});

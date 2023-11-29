import { load } from "js-yaml";
import { readFileSync } from "fs";
import { setPath } from "@/app/functions/general";
import { CharaProps, CharaListProps } from "../chara.d"

const rawData = readFileSync(setPath("@/app/character/list.yaml"), "utf8");

export const charaList = <CharaListProps>load(rawData);
export const charaMap = <Map<string, CharaProps>>new Map(Object.entries(charaList));

charaMap.forEach((chara, name) => {
  chara.id = name; 
})
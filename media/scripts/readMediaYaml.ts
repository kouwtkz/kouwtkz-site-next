import { setPath } from "@/app/functions/general"
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { ImageDataObject, ImageMapGroup } from "./media"
import fs from "fs"
import Path from "path"

export function ReadImageData(path: string, dir?: string) {
  return <ImageDataObject>load(readFileSync(setPath((dir || "") + path), "utf8"));
}

export function ReadImageDataGroup(pathes: Array<string>, dir?: string) {
  const groups = <ImageMapGroup>new Map();
  pathes.forEach(path => {
    groups.set(Path.basename(path), ReadImageData(path, dir));
  })
  return groups;
}

export function ReadImageDataGroupFromDir(dir: string) {
  dir = setPath(dir);
  const pathes = fs.readdirSync(dir);
  const groups = <ImageMapGroup>new Map();
  pathes.forEach(path => {
    const parsedPath = Path.parse(path);
    switch(parsedPath.ext) {
      case ".yaml":
      case ".yml":
        groups.set(parsedPath.name, ReadImageData(`${dir}/${path}`));
        break;
    }
  })
  return groups;
}

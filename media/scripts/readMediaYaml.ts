import { setPath } from "@/app/functions/general"
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { ImageDataObject, ImageGroupOptions, ImageMapGroup } from "./media"
import fs from "fs"
import Path from "path"

type ReadImageYamlProps = {
  path: string
  dir?: string
  options?: ImageGroupOptions
}

export function ReadImageYaml({ path, dir, options }: ReadImageYamlProps) {
  const data = <ImageDataObject>load(readFileSync(setPath((dir || "") + path), "utf8"));
  if (options) data.imageGroupOptions = options;
  return data;

}

export function ReadImageYamlGroup(pathes: Array<string>, dir?: string) {
  const groups = <ImageMapGroup>new Map();
  pathes.forEach(path => {
    groups.set(Path.basename(path), ReadImageYaml({ path, dir }));
  })
  return groups;
}

export function ReadImageYamlGroupFromDir(dir: string, options?: ImageGroupOptions) {
  dir = setPath(dir);
  const pathes = fs.readdirSync(dir);
  const groups = <ImageMapGroup>new Map();
  pathes.forEach(path => {
    const parsedPath = Path.parse(path);
    switch (parsedPath.ext) {
      case ".yaml":
      case ".yml":
        groups.set(parsedPath.name, ReadImageYaml({ path: `${dir}/${path}`, options: options }));
        break;
    }
  })
  return groups;
}

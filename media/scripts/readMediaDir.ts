import { setPath, getUrlFromPath } from "@/app/functions/general"
import { ImageDataObject, ImageGroupOptions } from "./media"
import fs from "fs"
import Path from "path"

export function readImagesDir(dir: string, options?: ImageGroupOptions) {
  const groupDir = getUrlFromPath(dir);
  dir = setPath(dir);
  const pathes = fs.readdirSync(dir);
  const group = <ImageDataObject>{
    dir: groupDir,
    list: [],
    imageGroupOptions: options
  }
  pathes.forEach(path => {
    const parsedPath = Path.parse(path);
    if (/\.(png|jpe?g)/i.test(parsedPath.ext)) {
      getUrlFromPath(path)
      group.list.push({ src: `${path}` });
    }
  });
  return group;
}
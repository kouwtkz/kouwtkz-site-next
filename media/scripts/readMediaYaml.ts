const rootPath = process.cwd();
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { ImageDataObject } from "./media"

function ReadMediaYaml(path: string) {
  path = path.replace(/^@/, rootPath);
  return <ImageDataObject>load(readFileSync(path, "utf8"));
}

export { ReadMediaYaml, rootPath }
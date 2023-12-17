import { statSync } from "fs";

export type DataStateProps = {
  file?: string;
  mtime?: Date;
  url: string;
}
export type DataStateReplacedProps = {
  url: string;
}
export function DataStateAddMtime({ file, mtime, url }: DataStateProps) {
  try {
    let v;
    if (file) v = Math.ceil(statSync(file).mtime.getTime() / 1000);
    else if (mtime) v = Math.ceil(mtime.getTime() / 1000);
    else v = Math.ceil(new Date().getTime() / 300000);
    return `${url}?v=${v}`;
  } catch (e) {
    console.error(e);
    return url;
  }
}

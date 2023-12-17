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
    if (file) mtime = statSync(file).mtime;
    else if (!mtime) mtime = new Date();
    return `${url}?v=${mtime?.getTime()}`;
  } catch (e) {
    console.error(e);
    return url;
  }
}

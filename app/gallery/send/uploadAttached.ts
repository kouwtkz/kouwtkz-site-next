import fs from "fs";
import path from "path";
import { MediaUpdate } from "@/mediaScripts/MediaUpdateModule.mjs";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

type Props = {
  attached: File[];
  attached_mtime: any[];
  uploadDir: string;
}
export function uploadAttached({ attached, attached_mtime = [], uploadDir }: Props) {
  let retVal = false
  attached = attached.filter(file => Boolean(file.name));
  if (attached.length > 0) {
    retVal = true;
    const now = new Date();
    const mediaDir = process.env.MEDIA_DIR || "_media";
    const dataDir = process.env.DATA_DIR || "";
    const publicDir = "public";
    const uploadImageDir = `${mediaDir}/${uploadDir}`;
    const uploadImagesFullDir = path.resolve(`${cwd}/${dataDir}/${uploadImageDir}`);
    const uploadPublicImagesFullDir = path.resolve(`${cwd}/${publicDir}/${uploadImageDir}`);
    try { fs.mkdirSync(uploadImagesFullDir, { recursive: true }); } catch { }
    try { fs.mkdirSync(uploadPublicImagesFullDir, { recursive: true }); } catch { }
    attached.forEach((file, i) => {
      file.arrayBuffer().then((abuf) => {
        const mTime = new Date(Number(attached_mtime[i]));
        const filename = file.name.replaceAll(" ", "_");
        const filePath = path.resolve(`${uploadImagesFullDir}/${filename}`);
        fs.writeFileSync(filePath, Buffer.from(abuf));
        fs.utimesSync(filePath, now, new Date(mTime));
      })
    })
    setTimeout(() => {
      MediaUpdate();
    }, 10);
  }
  return retVal;
}

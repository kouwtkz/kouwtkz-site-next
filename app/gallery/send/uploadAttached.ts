import fs from "fs";
import path from "path";
import { GetYamlImageList } from "@/mediaScripts/GetImageList.mjs";
// import { UpdateImageYaml } from "@/mediaScripts/UpdateImage.mjs";
import { ReadImageFromYamls as readImageHandle } from "@/mediaScripts/ReadImage.mjs";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

type Props = {
  attached: File[];
  attached_mtime?: any[];
  tags?: any[];
  uploadDir: string;
}
export async function uploadAttached({ attached, attached_mtime = [], tags = [], uploadDir }: Props) {
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
    attached.forEach(async (file, i) => {
      await file.arrayBuffer().then((abuf) => {
        const mTime = new Date(Number(attached_mtime[i]));
        const filename = file.name.replaceAll(" ", "_");
        const filePath = path.resolve(`${uploadImagesFullDir}/${filename}`);
        fs.writeFileSync(filePath, Buffer.from(abuf));
        fs.utimesSync(filePath, now, new Date(mTime));
      })
    })
    // await new Promise<void>((resolve, reject) => {
    //   setTimeout(async () => {
    //     UpdateImageYaml({ ...fromto }).then(async () => {
    //       const tagsFlag = tags.length > 0;
    //       if (tagsFlag) {
    //         const yamls = await GetYamlImageList({ ...fromto, readImageHandle, filter: { group: uploadDir, endsWith: true } });
    //         yamls.forEach(album => {
    //           attached.forEach(file => {
    //             const imageItem = album.list.find(item => item.src === file.name)
    //             if (imageItem) imageItem.tags = Array.from(new Set((imageItem.tags || []).concat(tags)));
    //           })
    //         })
    //         UpdateImageYaml({ yamls, deleteImage: false, ...fromto }).then(() => resolve());
    //       } else {
    //         resolve()
    //       }
    //     });
    //   }, 10);
    // });
    return retVal;
  }
  return retVal;
}

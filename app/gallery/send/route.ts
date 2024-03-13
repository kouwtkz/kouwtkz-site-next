import { NextRequest } from "next/server";
const isStatic = process.env.OUTPUT_MODE === "export";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { uploadAttached } from "./uploadAttached";
import { GetYamlImageList, UpdateImageYaml } from "@/mediaScripts/YamlImageFunctions.mjs";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";
import { resolve } from "path";
import { mkdirSync, renameSync, unlinkSync } from "fs";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });
  const formData = await req.formData();
  await uploadAttached({
    attached: (formData.getAll("attached[]") || []) as File[],
    attached_mtime: formData.getAll("attached_mtime[]"),
    tags: formData.getAll("tags[]"),
    uploadDir: String(formData.get("dir")) || "images/uploads"
  })
  return new Response("");
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { albumDir, src, origin, dir, time, deleteMode, move, rename, ...image } = data;
  const group = [albumDir];
  if (move) group.push(move);
  const yamls = await GetYamlImageList({ ...fromto, readImage: false, filter: { group, endsWith: true } });
  const imageTime = time ? new Date(time) : null;
  const editYaml = yamls.find(album => album.dir === albumDir);
  if (editYaml) {
    if (deleteMode) {
      const uploadImagesFullDir = resolve(`${cwd}/${editYaml.from}/${origin}`);
      try { unlinkSync(uploadImagesFullDir) } catch { }
      editYaml.list = editYaml.list.filter(item => item.origin !== origin);
      editYaml.data.list = editYaml.data.list?.filter(item => item.origin !== origin);
    } else {
      const imageItem = editYaml.list.find(item => item.origin === origin)
      if (imageItem) {
        const imageItemTime = imageItem?.time ? new Date(imageItem.time) : null;
        if (imageTime && (imageTime?.getTime() !== imageItemTime?.getTime())) {
          imageItem.time = imageTime.toLocaleString("sv-SE", { timeZone: "JST" }) + "+09:00"
        }
        Object.entries(image).forEach(([k, v]) => {
          imageItem[k] = v;
        });
        if (imageItem.topImage === null) delete imageItem.topImage;
        if (imageItem.pickup === null) delete imageItem.pickup;
        if (move || rename) {
          const imageFullpath = resolve(`${cwd}/${editYaml.from}/${origin}`);
          const moveYaml = (move ? yamls.find(album => album.dir === move) : null) || editYaml;
          if (move && editYaml.data.auto && !moveYaml.data.auto) imageItem.dir = "";
          const moveDir = `${cwd}/${moveYaml.from}/${moveYaml.dir}/${imageItem.dir}`;
          if (move) try { mkdirSync(resolve(moveDir)) } catch { }
          if (rename) imageItem.src = rename;
          const moveImageFullpath = resolve(`${moveDir}/${imageItem.src}`);
          renameSync(imageFullpath, moveImageFullpath);
          editYaml.list = editYaml.list.filter(({ src }) => imageItem.src !== src)
          moveYaml.list.push(imageItem);
        }
      }
    }
  }
  await UpdateImageYaml({ yamls, deleteImage: false, ...fromto }).then(() => {
    UpdateImageYaml({ ...fromto });
  })
  console.log("メディアの更新しました");

  return new Response("");
}

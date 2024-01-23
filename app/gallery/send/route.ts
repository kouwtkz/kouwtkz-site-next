import { NextRequest } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { uploadAttached } from "./uploadAttached";
import { GetYamlImageList, UpdateImageYaml } from "@/mediaScripts/YamlImageFunctions.mjs";
import { fromto } from "@/mediaScripts/UpdateOption.mjs";

export async function GET() {
  return new Response("");
}

export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });
  const formData = await req.formData();
  uploadAttached({
    attached: (formData.getAll("attached[]") || []) as File[],
    attached_mtime: formData.getAll("attached_mtime[]"),
    tags: formData.getAll("tags[]"),
    uploadDir: String(formData.get("dir")) || "images/uploads"
  })
  return new Response("");
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { albumDir, src, origin, dir, time, ...image } = data;
  const yamls = GetYamlImageList({ ...fromto, readImage: false, filter: { group: albumDir, endsWith: true } });
  const imageTime = time ? new Date(time) : null;

  yamls.forEach(album => {
    const imageItem = album.list.find(item => item.origin === origin)
    if (imageItem) {
      const imageItemTime = imageItem?.time ? new Date(imageItem.time) : null;
      if (imageTime && (imageTime?.getTime() !== imageItemTime?.getTime())) {
        imageItem.time = imageTime.toLocaleString("sv-SE", { timeZone: "JST" }) + "+09:00"
      }
      const _imageItem: any = imageItem;
      Object.entries(image).forEach(([k, v]) => {
        _imageItem[k] = v;
      });
    }
  })
  UpdateImageYaml({ yamls, deleteImage: false, ...fromto })
  console.log("メディアの更新しました");

  return new Response("");
}

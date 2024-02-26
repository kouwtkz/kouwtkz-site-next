import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import axios from "axios";
import toast from "react-hot-toast";

export async function upload({
  isServerMode,
  files,
  images,
  dir,
  tags: _tags,
  setImageFromUrl,
}: {
  isServerMode: boolean;
  files: File[];
  images: MediaImageItemType[];
  dir?: string;
  tags: string | string[];
  setImageFromUrl: Function;
}) {
  const tags = typeof _tags === "string" ? [_tags] : _tags;
  const checkTime = new Date().getTime();
  const targetFiles = files.filter(
    (file) =>
      Math.abs(checkTime - file.lastModified) > 200 ||
      !images.some(({ src, originName }) => [src, originName].some(n => n === file.name))
  );
  if (targetFiles.length === 0) return;
  if (isServerMode) {
    const formData = new FormData();
    formData.append("dir", dir || "");
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });
    targetFiles.forEach((file) => {
      formData.append("attached[]", file);
      if (file.lastModified)
        formData.append("attached_mtime[]", String(file.lastModified));
    });
    const res = await axios.post("/gallery/send", formData);
    if (res.status === 200) {
      toast("アップロードしました！", {
        duration: 2000,
      });
      setTimeout(() => {
        setImageFromUrl();
      }, 10 * targetFiles.length);
    }
  } else {
    toast.error("サーバーモードの場合のみアップロードできます", {
      duration: 2000,
    });
  }
}

import { MediaImageAlbumType } from "@/mediaScripts/MediaImageDataType";
import axios from "axios";
import toast from "react-hot-toast";

export async function upload({
  isServerMode,
  files,
  album,
  tags: _tags,
  setImageFromUrl,
}: {
  isServerMode: boolean;
  files: File[];
  album: MediaImageAlbumType;
  tags: string | string[];
  setImageFromUrl: Function;
}) {
  const tags = typeof _tags === "string" ? [_tags] : _tags;
  const checkTime = new Date().getTime() - 10;
  const targetFiles = files.filter(
    (file) =>
      file.lastModified < checkTime &&
      !album?.list.some((image) => image.src === file.name)
  );
  if (targetFiles.length === 0) return;
  if (isServerMode) {
    const formData = new FormData();
    formData.append("dir", album.dir || "");
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
      }, 250);
    }
  } else {
    toast.error("サーバーモードの場合のみアップロードできます", {
      duration: 2000,
    });
  }
}

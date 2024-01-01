// @ts-check
import fs from "fs";
import sharp from "sharp";
import { parse } from "path";

/**
 * @typedef {"contain" | "cover" | "fill" | "outside" | "inside"} FitMethod

 * @param {{ src: string; output: string; size?: number | { h: number, w: number } | null; quality?: number; fit?: FitMethod; }} param0
 */
export default async function RetouchImage({ src, output, size = null, quality, fit = "cover" }) {
  if ((() => {
    try {
      const toTime = fs.statSync(output).mtime;
      const fromTime = fs.statSync(src).mtime;
      return fromTime <= toTime;
    } catch {
      return false;
    }
  })()) return null

  const outputPath = parse(output);
  /** @type sharp.Sharp */
  const retouchImage = sharp(src);
  const metadata = await retouchImage.metadata();

  const { w, h } = typeof (size) === "number" ? { w: size, h: size } : (size !== null ? size : { w: null, h: null });
  if (w && h && metadata.width && metadata.height && ((w * h) < (metadata.width * metadata.height))) {
    retouchImage.resize(w, h, { fit: fit })
  }

  switch (outputPath.ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      retouchImage.jpeg(
        { quality }
      )
      break;
    case ".png":
      retouchImage.png(
        { compressionLevel: quality }
      )
      break;
    case ".webp":
      retouchImage.webp(
        { quality }
      )
      break;
  }

  fs.mkdir(outputPath.dir, { recursive: true }, () => {
    retouchImage.toFile(output);
  })
}

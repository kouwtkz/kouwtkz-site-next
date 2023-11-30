import fs from "fs";
import jimp from "jimp";

/**
 * @export
 * @param {{ src: string; output: string; w?: number; h?: number; size?: number; quality?: number; method?: ("outside" | "cover" | "contain" | "scaleToFit"); }} param0
 * @param {string} param0.src
 * @param {string} param0.output
 * @param {number} param0.w
 * @param {number} param0.h
 * @param {number} param0.size
 * @param {number} param0.quality
 * @param {("outside" | "cover" | "contain" | "scaleToFit")} [param0.method="cover"]
 * @returns {*}
 */
export default function MakeResize({ src, output, w, h, size, quality, method = "cover" }) {
  if (fs.existsSync(output)) return null;
  return jimp.read(src, (err, img) => {
    if (err) {
      console.log(src, output);
      throw err;
    };
    const bw = img.bitmap.width;
    const bh = img.bitmap.height;
    if (size) {
      switch (method) {
        case "outside":
          if (bw === bh) {
            img.contain(size, size);
          } else if (bw > bh) {
            img.contain(size * bw / bh, size);
          } else {
            img.contain(size, size * bh / bw);
          }
          break;
        case "contain":
          img.contain(size, size);
          break;
        case "cover":
          img.cover(size, size);
          break;
        case "scaleToFit":
          img.scaleToFit(size, size);
          break;
      }
    } else if (h || w) {
      const rw = w ? w : ((h || 1) * bw / bh)
      const rh = h ? h : ((w || 1) * bh / bw)
      img.resize(rw, rh)
    }
    if (quality) img.quality(quality);
    img.write(output);
  })
}

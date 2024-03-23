// @ts-check

import imageSize from "image-size";

/**
 * @typedef { import("./MediaImageYamlType.d.ts").readImageHandleProps } readImageHandleProps
 * /
/**
 * @param {readImageHandleProps} args
 */
export function ReadImageFromYamls({ yamls, readSize = true, resizedDir = 'resized' }) {
  yamls.forEach((y) => {
    // 画像URLの定義
    y.list.forEach(async (image) => {
      const imageDir = `/${y.to}/${y.dir}/${image.dir || ""}/`.replace(/\/+/g, '/');
      const toWebp = !/\.(svg|gif)$/i.test(image.src);
      image.src = toWebp ? image.src.replace(/[^.]+$/, "webp") : image.src;
      image.URL = `${imageDir}${image.src}`;
      image.resizeOption = image.resizeOption ? (Array.isArray(image.resizeOption) ? image.resizeOption : [image.resizeOption]) : [];
      if (/^thumbnail/i.test(image.src) && !image.resizeOption.some(({ mode }) => mode === "thumbnail")) {
        image.resizeOption.push({ mode: "thumbnail" });
      }
    });
    // リサイズまわり
    const yResizeOptions = y.data.resizeOption ? (Array.isArray(y.data.resizeOption) ? y.data.resizeOption : [y.data.resizeOption]) : [];
    y.list.forEach((image) => {
      // svgファイル以外はリサイズ対象にする
      if (!/\.(svg)$/i.test(image.src)) {
        image.resizeOptions = yResizeOptions.concat(image.resizeOption ? (Array.isArray(image.resizeOption) ? image.resizeOption : [image.resizeOption]) : [])
        image.resized = [];
        const resized = image.resized;
        image.resizeOptions.forEach(async resizeOption => {
          if (!resizeOption.mode) resizeOption.mode = "thumbnail";
          switch (resizeOption.mode) {
            case "icon":
              if (!resizeOption.size) resizeOption.size = 48;
              if (!resizeOption.ext) resizeOption.ext = "webp"
              break;
            case "thumbnail":
              if (!resizeOption.size) resizeOption.size = 340;
              if (!resizeOption.quality) resizeOption.quality = 80;
              if (!resizeOption.ext) resizeOption.ext = "webp"
              break;
          }
          const resizedImageDir = `/${y.to}/${resizedDir}/${resizeOption.mode}/${y.dir}/${image.dir || ""}/`.replace(/\/+/g, '/');
          const resizedImageUrl = `${resizedImageDir}${image.src.replace(/[^.]+$/, "webp")}`;
          resizeOption.url = resizedImageUrl;
          resized.push({ mode: resizeOption.mode, src: resizedImageUrl })
        })
        delete image.resizeOption;
      }
    })
    y.list.forEach((image) => {
      if (image.origin) {
        if (readSize) {
          try {
            const size = imageSize(image.origin);
            if (size.width && size.height) image.size = { w: size.width, h: size.height }
          } catch { }
        }
        delete image.fullPath;
      }
    });
  })
}

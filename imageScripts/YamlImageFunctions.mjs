// @ts-check

import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import fs from "fs";
import { resolve, extname, dirname, parse } from "path";
import RetouchImage from "./RetouchImage.mjs"
import sharp from "sharp";

/**
 * @typedef {{ name: string; dir: string; }} _Dirent
 * @typedef { import("./MediaImageYamlType").YamlDataType } YamlDataType
 * @typedef { import("./MediaImageYamlType").YamlGroupType } YamlGroupType
 * @typedef { import("./MediaImageYamlType").YamlDataImageType } YamlDataImageType
 * @typedef { import("./MediaImageYamlType").GetYamlImageListProps } GetYamlImageListProps
 * @typedef { import("./MediaImageDataType.d.ts").MediaImageItemType } MediaImageItemType
 * @typedef { import("./MediaImageDataType.d.ts").MediaImageAlbumType } MediaImageAlbumType
 */

/**
 * @param {GetYamlImageListProps} args
 * @returns {YamlGroupType[]}
 */
export function GetYamlImageList({ path: root, filter, readImage = true, makeImage = false, deleteImage = false }) {
  // ディレクトリ内の各ファイルを取得
  /** @type fs.Dirent[] */
  let files = [];
  try {
    files = fs.readdirSync(root, { recursive: true, withFileTypes: true })
      .filter(dirent => dirent.isFile())
  } catch (e) {
    console.error(e);
  }
  const ls = files.reduce((a, dirent) => {
    const dirChild = dirent.path.replace(root, "").replace(/\\/g, "/");
    /** @type _Dirent */
    const v = { name: dirent.name, dir: dirChild }
    const ext = extname(dirent.name);
    if (/^\.(ya?ml)$/i.test(ext))
      a.yamls.push(v);
    else if (/^\.(png|jpe?g|gif|webp|svg)$/i.test(ext))
      a.images.push(v);
    return a;
  },
    {
    /** @type _Dirent[] */ yamls: [],
    /** @type _Dirent[] */ images: []
    })

  // 次にyamlファイルのリストを作成
  /** @type YamlGroupType[] */
  let yamls = ls.yamls.map((yaml) => {
    const dataStr = String(fs.readFileSync(resolve(`${root}/${yaml.dir}/${yaml.name}`)))
    /** @type YamlDataType */
    const data = dataStr ? yamlParse(dataStr) : {};
    /** @type YamlDataImageType[] */
    const list = [];
    return { data, list, root, already: Boolean(dataStr), ...yaml };
  }).filter(y => y.already).sort((a, b) => a < b ? 1 : -1);
  ls.images.forEach(img => {
    let candidate = yamls.find(yaml => img.dir.startsWith(yaml.dir));
    // 取得した候補に再帰定義がなく、同一フォルダでなければ新規定義
    if (candidate === undefined || (candidate.dir !== img.dir && !candidate.data.recursive)) {
      candidate = { ...img, root, name: "_data.yaml", already: false, list: [], data: { recursive: true, listup: false } };
      yamls.unshift(candidate);
    }
    let dir = img.dir.replace(candidate.dir, "");
    if (/\/\.\w+$/i.test(dir)) {
      candidate = { ...img, root, dir: img.dir, name: "_data.yaml", already: false, list: [], data: { recursive: true, listup: false } };
      dir = img.dir.replace(dir, "");
      yamls.unshift(candidate);
    }
    if (!candidate.list?.some(c => c.src === img.name)) {
      const stat = fs.statSync(resolve(`${root}/${img.dir}/${img.name}`));
      candidate.list.push({ name: parse(img.name).name, src: img.name, dir, time: stat.mtime.toLocaleString("sv-SE", { timeZone: "JST" }) + "+09:00" });
    }
  })
  // リストの突合処理
  yamls.forEach((y) => {
    y.list = y.list.map((yItem) => {
      const foundIndex = (y.data.list || []).findIndex((ydItem) => ydItem.src === yItem.src);
      const ydItem = (y.data.list && foundIndex >= 0) ? y.data.list[foundIndex] : null;
      const item = ydItem ? { ...yItem, ...ydItem, dir: yItem.dir } : yItem;
      if (y.data.list && foundIndex >= 0) y.data.list[foundIndex] = item;
      return item;
    }
    );
  })
  if (filter && Object.keys(filter).length > 0) {
    const filterGroup = filter.group;
    if (filterGroup) yamls = yamls.filter((y) => (y.data.name || y.dir).match(filterGroup))
    const filterListup = filter.listup;
    if (filterListup !== undefined) yamls = yamls.filter(({ data }) => data?.listup === undefined ? false : data.listup === filterListup);
    const filterArchive = filter.archive;
    if (filterArchive !== undefined) yamls = yamls.filter(({ dir }) => (/\.archive$/.test(dir)) === filterArchive)
    const filterPath = filter.path;
    if (filterPath) yamls.forEach((y) => {
      y.list = y.list.filter(({ dir, src }) => {
        const matched = (y.dir + dir + '/' + src).match(filterPath);
        return matched;
      })
    })
    const filterTags = filter.tags ? (typeof filter.tags === "string" ? [filter.tags] : filter.tags) : [];
    if (filterTags.length > 0) yamls.forEach((y) => {
      y.list = y.list.filter(({ tags }) => tags?.some(tag => filterTags.some(ftag => ftag === tag)))
    })
    if (filter.topImage) yamls.forEach((y) => {
      y.list = y.list.filter(({ topImage }) => topImage)
    })
    // サムネサイズ設定や画像生成処理
    if (readImage) ReadImageFromYamls({ yamls, makeImage, deleteImage })

    yamls = yamls.filter(({ list }) => list.length > 0)
  }
  return yamls;
}

/**
 * @param {{yamls: YamlGroupType[], makeImage?: boolean, deleteImage?: boolean, publicDir?: string, resizedDir?: string}} args
 */
export function ReadImageFromYamls({ yamls, makeImage = false, deleteImage = false, publicDir = 'public', resizedDir = 'resized' }) {
  const cwd = process.cwd();
  const roots = (makeImage) ? Array.from(new Set(yamls.map(({ root }) => root))) : [];
  /** @type {{isFile: boolean, path: string}[]} */
  let currentPublicItems = [];
  roots.forEach(root => {
    const path = resolve(`${cwd}/${publicDir}/${root}`);
    try { fs.mkdirSync(path, { recursive: true }) } catch { }
    currentPublicItems = currentPublicItems.concat(
      fs.readdirSync(path, { recursive: true, withFileTypes: true })
        .map(dirent => ({ isFile: dirent.isFile(), path: resolve(`${dirent.path}/${dirent.name}`) }))
    )
  })
  /** @type string[] */
  const outputPublicImages = [];
  yamls.forEach(y => {
    // 画像URLの定義
    y.list.forEach((image) => {
      const imageDir = `/${y.root}/${y.dir}/${image.dir || ""}/`.replace(/\/+/g, '/');
      if (makeImage) {
        image.fullPath = resolve(`${cwd}${imageDir}${image.src}`);
        image.mtime = new Date(fs.statSync(image.fullPath).mtime);
      }
      const baseImageFullPath = image.fullPath;
      const toWebp = !/\.(svg|gif)$/i.test(image.src);
      image.src = toWebp ? image.src.replace(/[^.]+$/, "webp") : image.src;
      image.URL = `${imageDir}${image.src}`;
      image.resizeOption = image.resizeOption ? (Array.isArray(image.resizeOption) ? image.resizeOption : [image.resizeOption]) : [];
      if (/^thumbnail/i.test(image.src) && !image.resizeOption.some(({ mode }) => mode === "thumbnail")) {
        image.resizeOption.push({ mode: "thumbnail" });
      }
      if (makeImage && baseImageFullPath) {
        const baseImageFullPath = image.fullPath;
        const imageFullPath = resolve(`${cwd}/${publicDir}${image.URL}`);
        outputPublicImages.push(imageFullPath);
        let copy = true;
        const mtimeBase = image.mtime;
        if (mtimeBase && currentPublicItems.some(({ path }) => path === imageFullPath)) {
          const mtimeCurrent = new Date(fs.statSync(imageFullPath).mtime);
          copy = mtimeBase > mtimeCurrent;
        }
        if (copy) {
          fs.mkdir(dirname(imageFullPath), { recursive: true }, () => {
            if (baseImageFullPath) {
              if (toWebp) sharp(baseImageFullPath).webp().toFile(imageFullPath);
              else fs.copyFile(baseImageFullPath, imageFullPath, () => { })
            }
          })
        }
      }
    });
    // リサイズまわり
    const yResizeOptions = y.data.resizeOption ? (Array.isArray(y.data.resizeOption) ? y.data.resizeOption : [y.data.resizeOption]) : [];
    y.list.forEach((image) => {
      // svgファイル以外はリサイズ対象にする
      if (!/\.(svg)$/i.test(image.src)) {
        const baseImageFullPath = image.fullPath;
        const resizeOptions = yResizeOptions.concat(image.resizeOption ? (Array.isArray(image.resizeOption) ? image.resizeOption : [image.resizeOption]) : [])
        resizeOptions.forEach(resizeOption => {
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
          const resizedImageDir = `/${y.root}/${resizedDir}/${resizeOption.mode}/${y.dir}/${image.dir || ""}/`.replace(/\/+/g, '/');
          const resizedImageUrl = `${resizedImageDir}${image.src.replace(/[^.]+$/, "webp")}`;
          if (makeImage && baseImageFullPath) {
            const resizedImageFullPath = resolve(`${cwd}/${publicDir}${resizedImageUrl}`);
            let make = true;
            const mtimeBase = image.mtime;
            if (mtimeBase && currentPublicItems.some(({ path }) => path === resizedImageFullPath)) {
              const mtimeCurrent = new Date(fs.statSync(resizedImageFullPath).mtime);
              make = mtimeBase > mtimeCurrent;
            }
            if (make) {
              RetouchImage({ ...{ src: baseImageFullPath, output: resizedImageFullPath }, ...resizeOption });
            }
            outputPublicImages.push(resizedImageFullPath);
          }
        })
      }
    })
    if (makeImage) {
      y.list.forEach((image) => {
        delete image.fullPath;
        delete image.mtime;
      });
    }

  })
  if (deleteImage) {
    const currentPublicImages = currentPublicItems.filter(item => item.isFile).map(({ path }) => path);
    const deletePublicImages = currentPublicImages.filter(path => !outputPublicImages.some(_path => _path === path))
    deletePublicImages.forEach(path => { fs.unlink(resolve(path), () => { }); })
  }
}

/**
 * @param {GetYamlImageListProps} args
 * @returns
 */
export function UpdateImageYaml({ readImage = true, makeImage = true, deleteImage = true, ...args }) {
  // yamlを管理するメディアディレクトリ
  const baseDir = args.path;
  const yamls = GetYamlImageList({ readImage: false, ...args });

  // yamlが手動で更新されていればyamlの更新の通りに反映させる
  yamls.filter(y => {
    try {
      if (y.data.mtime) {
        const stat = fs.statSync(resolve(`${baseDir}/${y.dir}/${y.name}`));
        const mtime = new Date(y.data.mtime);
        return (stat.mtime.getTime() - mtime.getTime()) > 1500
      } else return false;
    } catch {
      return false;
    }
  }).forEach(y => {
    y.data.list?.forEach(img => {
      /** @type {{index: number, dir: string} | undefined} */
      let foundListItem;
      yamls.some((y) => {
        if (!y.data.listup) return false;
        const foundIndex = (y.list || []).findIndex(d => (d.src === img.src));
        if (foundIndex >= 0) {
          foundListItem = { index: foundIndex, dir: y.dir };
          return true;
        }
      }, []);
      if (foundListItem) {
        /** @type YamlDataImageType | undefined */
        let gotItem;
        if (y.dir === foundListItem.dir) {
          const foundImage = y.list[foundListItem.index];
          if ((img.dir || '') !== foundImage.dir) {
            try {
              fs.renameSync(
                resolve(`${baseDir}/${y.dir}/${foundImage.dir || ""}/${foundImage.src}`),
                resolve(`${baseDir}/${y.dir}/${img.dir || ""}/${img.src}`),
              )
            } catch { }
            foundImage.dir = img.dir;
          }
        } else {
          const foundYaml = yamls.find(y => y.dir === foundListItem?.dir);
          if (foundYaml) {
            const spliceItems = foundYaml.list?.splice(foundListItem.index, 1) || [];
            if (spliceItems.length > 0) gotItem = spliceItems[0];
            if (gotItem) {
              try {
                fs.renameSync(
                  resolve(`${baseDir}/${foundYaml.dir}/${gotItem.dir || ""}/${gotItem.src}`),
                  resolve(`${baseDir}/${y.dir}/${img.dir || ""}/${img.src}`),
                )
              } catch { }
              y.list?.push(gotItem)
            };
          }
        }
        if (gotItem && !gotItem.tags) gotItem.tags = [];
      } else {
        y.data.list?.push({ ...img, tags: [] })
      }
    });
  });

  // yamlのリストアップ処理
  yamls.forEach((y) => {
    if (y.data.listup) {
      if (!y.data.list) y.data.list = [];
      y.list.forEach(img => {
        const foundSelfImg = y.data.list?.find(_img => _img.src === img.src);
        if (foundSelfImg) {
          if (img.dir)
            foundSelfImg.dir = img.dir;
          else
            delete foundSelfImg.dir;
        } else {
          /** @type {{index: number, dir: string} | undefined} */
          let foundYamlItem;
          yamls.some((y) => {
            const foundIndex = (y.data.list || []).findIndex(_img => (_img.src === img.src) && !y.list.some(item => item.src === _img.src));
            if (foundIndex >= 0) {
              foundYamlItem = { index: foundIndex, dir: y.dir };
              return true;
            }
          }, []);
          if (foundYamlItem) {
            /** @type YamlDataImageType | undefined */
            let gotItem;
            if (y.dir !== foundYamlItem.dir) {
              const spliceItems = yamls.find(y => y.dir === foundYamlItem?.dir)?.data.list?.splice(foundYamlItem.index, 1) || [];
              if (spliceItems.length > 0) gotItem = spliceItems[0];
              if (gotItem) y.data.list?.push(gotItem);
            } else {
              if (y.data.list) {
                gotItem = y.data.list[foundYamlItem.index];
              }
            }
            if (gotItem && !gotItem.tags) gotItem.tags = [];
          } else {
            y.data.list?.push({ ...img, tags: [] })
          }
        }
      });
    }
  })

  // リストの重複削除とリスト内処理
  yamls.forEach((y) => {
    /** @type Map<string, YamlDataImageType> */
    const map = new Map();
    y.data.list?.forEach(item => { if (!map.has(item.src)) map.set(item.src, item) })
    const values = Array.from(map.values());
    y.data.notfound = y.data.notfound || [];
    const notfound = y.data.notfound;
    if (values.length > 0) {
      if (y.data.listup) {
        // 存在しなかったファイルをnotfoundに入れる
        values.filter(di => !y.list?.some(yi => yi.src === di.src))
          .forEach(item => {
            notfound.push(values.splice(values.findIndex(yi => yi.src === item.src), 1)[0]);
          })
        // 付与処理
        y.data.list?.forEach((img) => {
          if (y.data.fanart !== undefined && img.fanart === undefined) img.fanart = y.data.fanart;
          if (y.data.collaboration !== undefined && img.collaboration === undefined) img.collaboration = y.data.collaboration;
          if (y.data.copyright !== undefined && img.copyright === undefined) img.copyright = y.data.copyright;
          // オートフォルダリング
          if (y.data.auto) {
            let dir = img.dir || '';
            if (!dir) {
              if (img.time) {
                // 年ごとにフォルダリング
                if (y.data.auto === "year") {
                  dir = "/" + new Date(img.time).toLocaleString("ja", { timeZone: "JST" }).split("/", 1)[0]
                }
              }
              if (dir !== (img.dir || '')) {
                try { fs.mkdirSync(resolve(`${baseDir}/${y.dir}/${dir}`)) } catch { }
                finally {
                  fs.renameSync(
                    resolve(`${baseDir}/${y.dir}/${img.dir || ""}/${img.src}`),
                    resolve(`${baseDir}/${y.dir}/${dir}/${img.src}`)
                  )
                }
              }
            }
          }
        })
      }
      y.data.list = values;
    }
    if (notfound.length === 0) delete y.data.notfound;

    // 余分なデータの削除する
    y.data.list?.forEach((item) => {
      if (Array.isArray(item.resizeOption) && item.resizeOption.length === 0) delete item.resizeOption;
      if (item.dir === "") delete item.dir;
      if (item.description === "") delete item.description;
      if (item.tags?.length === 0 || item.tags === null) delete item.tags;
      if (item.title) { item.name = item.title; delete item.title; }
    })
    // ソート
    if (y.data.list) {
      y.data.list.sort((a, b) => a.time && b.time ? (new Date(b.time).getTime()) - (new Date(a.time).getTime()) : 0)
    }
  })

  const write_mtime = new Date().toLocaleString("sv-SE", { timeZone: "JST" }) + "+09:00"

  yamls.forEach((y) => {
    const outputPath = resolve(`${baseDir}/${y.dir}/${y.name}`);
    y.data.mtime = write_mtime;
    try {
      fs.writeFileSync(outputPath, yamlStringify(y.data))
    } catch { }
  })

  if (readImage) ReadImageFromYamls({ yamls, makeImage, deleteImage })
}

/**
 * @param {YamlGroupType[]} yamls
 * @returns {MediaImageAlbumType[]}
 */
export function GetMediaImageAlbumFromYamls(yamls) {
  return yamls.map((y) => {
    const { list: ydList, name: ydName, description = "", visible = {}, time: ydTime = null } = y.data;
    const list = y.list.map((item) => {
      const { time = null, ..._item } = item
      /** @type MediaImageItemType */
      const mediaImageItem = { ..._item, time: (time ? new Date(time) : null) }
      return mediaImageItem;
    });
    const name = ydName || y.dir;
    const time = ydTime ? new Date(ydTime) : null;
    return { dir: y.dir, list, name, description, visible, time }
  })
}

/**
 * @param {GetYamlImageListProps} args
 * @returns {MediaImageAlbumType[]}
 */
export function GetMediaImageAlbums(args) {
  return GetMediaImageAlbumFromYamls(
    GetYamlImageList(args)
  );
}

/**
 * @param {MediaImageAlbumType[]} albums
 * @returns {MediaImageItemType[]}
 */
export function CastMediaImagesFromAlbums(albums) {
  /** @type MediaImageItemType[] */
  const items = [];
  albums.forEach((group) => {
    group.list.forEach((item) => {
      item.album = group;
      items.push(item);
    })
  })
  return items;
}

/**
 * @param {GetYamlImageListProps} args
 * @returns {MediaImageItemType[]}
 */
export function GetMediaImages(args) {
  return CastMediaImagesFromAlbums(
    GetMediaImageAlbums(args)
  );
}

// @ts-check

import { env } from 'process';
import dotenv from 'dotenv';
if (!env.MEDIA_DIR) dotenv.config();
import sizeOf from "image-size"

import fs from "fs"
import path from "path"
import { parse } from "yaml";
import RetouchImage from "./RetouchImage.mjs"
import sharp from 'sharp';

// 環境変数たち
const isStatic = env.OUTPUT_MODE === 'export';
const cwd = process.cwd();

const dataDir = env.DATA_DIR || "_data";
const mediaDir = env.MEDIA_DIR || "_media";
const resizedDir = env.RESIZED_DIR || "resized";

// 画像のURLのパス
const host = "";
const publicDir = "public";

/** @type {MediaImageGroupsType[]} */
let imageGroups = [];
const imageDirListPath = path.resolve(`./${dataDir}/image/imageGroups.yaml`);
try {
  imageGroups = parse(String(fs.readFileSync(imageDirListPath)));
  imageGroups.forEach(groupItem => {
    if (!groupItem.path.startsWith('/')) groupItem.path = `${mediaDir}/${groupItem.path}`;
    if (groupItem.recursive === undefined) groupItem.recursive = true;
    groupItem.output = {...{webp: true, get: true},...groupItem.output}
  })
} catch { }

// 画像とみなす拡張子
const imageRe = /\.(png|jpe?g|gif)$/i;


/** @type {Map<string, any>} */
const publicMediaList = new Map()

/**
 * @summary 参照渡しで加工する関数
 * @param {MediaImageItemType & {time?: any}} image
 * @param {MediaImageGroupsType} groupItem
 * @param {getImageListType} getImageOption[]
 */
function readImage(image, groupItem, getImageOption = {}) {
  const baseImagePath = `/${image.dir}/${image.src}`;
  const baseImageFullPath = path.resolve(`${cwd}/${baseImagePath}`);
  image.time = image.time ? image.time : (image.time === null ? null : new Date(fs.statSync(baseImageFullPath).mtime));
  image.path = baseImagePath;
  if (groupItem.output?.webp && /(png|jpe?g)$/i.test(image.src)) {
    const webpImageSrc = image.src.replace(/[^.]+$/, "webp");
    const webpImagePath = `/${image.dir}/${webpImageSrc}`;
    if (getImageOption.doMakeImage) {
      const webpFullPath = path.resolve(`${cwd}/${publicDir}/${webpImagePath}`);
      fs.mkdir(path.dirname(webpFullPath), { recursive: true }, () => {
        sharp(baseImageFullPath).webp().toFile(webpFullPath);
      })
      publicMediaList.set(webpFullPath, true);
    }
    image.path = webpImagePath;
  } else {
    if (getImageOption.doMakeImage) {
      const copyFullPath = path.resolve(`${cwd}/${publicDir}/${image.path}`);
      publicMediaList.set(copyFullPath, true);
      if ((() => {
        try {
          const copyToTime = fs.statSync(copyFullPath).mtime;
          const copyFromTime = fs.statSync(baseImageFullPath).mtime;
          return copyFromTime > copyToTime;
        } catch {
          return true;
        }
      })()) { fs.copyFile(baseImageFullPath, copyFullPath, () => { }); }
    }
  }

  image.URL = `${host}${image.path}`;
  const dimensions = sizeOf(baseImageFullPath);
  const width = Number(dimensions.width);
  const height = Number(dimensions.height);
  image.info = { width, height, type: `${dimensions.type}`, wide: width > height }
  if (imageRe.test(image.src)) {
    const resizeOptions = groupItem.resizeOption ? (Array.isArray(groupItem.resizeOption) ? groupItem.resizeOption : [groupItem.resizeOption]) : [];
    resizeOptions.forEach((v) => {
      const resizeOption = Object.assign({}, v);
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
      // const resizedBase = resizeOption.ext ? baseImagePath?.replace(/[^.]+$/, resizeOption.ext) : baseImagePath;
      const resizedUrl = baseImagePath.replace(mediaDir, `${mediaDir}/${resizedDir}/${resizeOption.mode}`).replace(/[^.]+$/, "webp");
      const resizedFullPath = path.resolve(`${cwd}/${publicDir}${resizedUrl}`);
      if (getImageOption.doMakeImage) {
        RetouchImage({ ...{ src: baseImageFullPath, output: resizedFullPath }, ...resizeOption });
        publicMediaList.set(resizedFullPath, true);
      }
      if (!image.resized) image.resized = [];
      image.resized?.push({ src: resizedUrl, option: resizeOption });
    });
  }
  return image;
}

/**
 * @typedef {{ albumName?: string | string[]; imageName?: string; tagName?: string, pathMatch?: string | RegExp, topImage?: boolean }} FilterOptionProps;
 * @param {getImageListType | string} [getImageOptionArgs];
 * @returns {MediaImageAlbumType[]};
 */
export function getImageAlbums(getImageOptionArgs = {}) {
  const getImageOption = (typeof (getImageOptionArgs) === "string") ? { filter: { albumName: getImageOptionArgs } } : getImageOptionArgs;
  /** @type FilterOptionProps */
  const filter = ((typeof (getImageOption.filter) === "string") ? { albumName: getImageOption.filter } : getImageOption.filter) || {};
  const onceAlbum = getImageOption.onceAlbum || false;
  const onceImage = getImageOption.onceImage || false;
  const filterAlbumNames = filter.albumName ? (Array.isArray(filter.albumName) ? filter.albumName : [filter.albumName]) : [];

  /** @type MediaImageAlbumType[] */
  const allResult = [];

  imageGroups.some(
    (groupItem) => {
      const groupName = groupItem.name || path.basename(groupItem.path);
      if (!groupItem.yaml && filterAlbumNames.length > 0 && !filterAlbumNames.some(fname => fname === groupName)) return null;
      /** @type MediaImageAlbumType | null */
      const dirAlbum = groupItem.yaml ? null : {
        dir: groupItem.path,
        name: groupName,
        list: []
      };
      const baseFullPath = path.resolve(`${cwd}/${groupItem.path}`);

      try {
        fs.readdirSync(baseFullPath, { recursive: groupItem.recursive, withFileTypes: true })
          .filter(dirent => !/\.archive/.test(dirent.path) && dirent.isFile())
          .forEach((dirent) => {
            const childFullPath = path.resolve(`${dirent.path}/${dirent.name}`);
            const parsedPath = path.parse(childFullPath);
            if (/\.ya?ml/i.test(parsedPath.ext)) {
              if (groupItem.yaml && (filterAlbumNames.length === 0 || filterAlbumNames.some(fname => fname === parsedPath.name))) {
                /** @type MediaImageAlbumType */
                // @ts-ignore
                const album = parse(String(fs.readFileSync(childFullPath, "utf8")));
                album.list = album.list.filter((item) => {
                  if (filter.imageName && filter.imageName !== item.name) return false;
                  if (filter.tagName && item.tags && !item.tags.some(tag => tag === filter.tagName)) return false;
                  if (filter.topImage && !item.topImage) return false;
                  item.dir = album.dir || '';
                  if (filter.pathMatch && !`/${item.dir}/${item.src}`.match(filter.pathMatch)) return false;
                  if (!item.dir.startsWith('/')) item.dir = `${mediaDir}/${item.dir}`;
                  readImage(item, groupItem, getImageOption);
                  return true;
                });
                if (onceImage && album.list.length > 0) album.list = [album.list[0]];
                if (groupItem.output?.get && album.list.length > 0) allResult.push(album)
              }
            } else {
              if (dirAlbum !== null && !filter.tagName) {
                if (imageRe.test(parsedPath.ext)) {
                  const dir = groupItem.path + dirent.path.replace(baseFullPath, '').replaceAll('\\', '/');
                  const url = dir + '/' + dirent.name;
                  if (filter.imageName && filter.imageName !== parsedPath.name) return false;
                  if (filter.pathMatch && !url.match(filter.pathMatch)) return false;
                  if (filter.topImage) return false;
                  dirAlbum.list.push(readImage({ name: parsedPath.name, src: dirent.name, dir }, groupItem, getImageOption))
                }
              }
            }
            if ((onceAlbum || onceImage) && allResult.length > 0) return true
            else if (onceImage && dirAlbum !== null && dirAlbum.list.length > 0) return true;

          })
      } catch (e) {
        // ここのエラーは定義したメディアのディレクトリがないときに多い
        console.error(e);
      }
      if (groupItem.output?.get && dirAlbum !== null && dirAlbum.list.length > 0) allResult.push(dirAlbum);
      if ((onceAlbum || onceImage) && allResult.length > 0) return true;
    }
  )
  if (getImageOption.doMakeImage) {
    fs.readdir(path.resolve(`${cwd}/${publicDir}/${mediaDir}`), { recursive: true, withFileTypes: true }, (err, dirents) => {
      if (err) return;
      dirents.filter((dirent) =>
        dirent.isFile() &&
        !publicMediaList.has(path.resolve(`${dirent.path}/${dirent.name}`))
      ).forEach((dirent) => {
        fs.unlink(path.resolve(`${dirent.path}/${dirent.name}`), () => { });
      })
    })
  }
  return allResult;
}

/**
 * @param {getImageListType | string} [getImageOption];
 * @returns {MediaImageAlbumType | null};
 */
export function getImageAlbum(getImageOption = {}) {
  if (typeof (getImageOption) === "string") getImageOption = { filter: { albumName: getImageOption } }
  const albums = getImageAlbums({ ...getImageOption, ...{ onceAlbum: true } });
  if (albums.length > 0)
    return albums[0];
  else
    return null;
}


/**
 * @param {getImageListType | string} [getImageOption];
 * @returns {MediaImageItemType[]};
 */
export function getImageItems(getImageOption = {}) {
  if (typeof (getImageOption) === "string") getImageOption = { filter: { imageName: getImageOption } }
  const albums = getImageAlbums(getImageOption);
  return parseImageItems(albums);
}

/**
 * @param {getImageListType | string} [getImageOption];
 * @returns {MediaImageItemType | null};
 */
export function getImageItem(getImageOption = {}) {
  if (typeof (getImageOption) === "string") getImageOption = { filter: { imageName: getImageOption } }
  const images = getImageItems({ ...getImageOption, ...{ onceAlbum: true } });
  if (images.length > 0)
    return images[0];
  else
    return null;
}


/**
 * @param {MediaImageAlbumType[]} imageAlbums;
 * @returns {MediaImageItemType[]};
 */
export function parseImageItems(imageAlbums) {
  /** @type {MediaImageItemType[]} */
  const imageList = [];
  imageAlbums.forEach((album => {
    album.list.forEach(item => {
      imageList.push(item);
    })
  }))
  return imageList;
}

/**
 * @typedef { import("./MediaImageType.d.ts").getImageListType } getImageListType
 * @typedef { import("./MediaImageType.d.ts").MediaImageGroupsType } MediaImageGroupsType
 * @typedef { import("./MediaImageType.d.ts").ResizeMode } ResizeMode
 * @typedef { import("./MediaImageType.d.ts").FitMethod } FitMethod
 * 
 * @typedef { import("./MediaImageType.d.ts").ResizeOptionType } ResizeOptionType
 * @typedef { import("./MediaImageType.d.ts").MediaImageAlbumType } MediaImageAlbumType
 * @typedef { import("./MediaImageType.d.ts").MediaImageItemType } MediaImageItemType
 * @typedef { import("./MediaImageType.d.ts").MediaImageInfoType } MediaImageInfoType
 * 
*/

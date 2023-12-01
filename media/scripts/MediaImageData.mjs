// @ts-check

import dotenv from 'dotenv';
if (!process.env.PUBLIC_DIR) dotenv.config();
import sizeOf from "image-size"

import fs from "fs"
import path from "path"
import { load } from "js-yaml";
import RetouchImage from "./RetouchImage.mjs"

/**
 * @comments ディレクトリ指定のオプション
 * @typedef {{
 * path: string;
 * yaml?: boolean;
 * name?: string;
 * recursive?: boolean;
 * resizeOption?: ResizeOptionProps | ResizeOptionProps[];
 * }} MediaImageDirProps;
 * 
 * @typedef { "icon" | "thumbnail" | "simple" } ResizeMode
 * @typedef {"contain" | "cover" | "fill" | "outside" | "inside"} FitMethod
 * 
 * @typedef {{
 *  mode?: ResizeMode;
 *  ext?: string;
 *  size?: number | { w: number, h: number };
 *  quality?: number;
 *  fit?: FitMethod;
 * }} ResizeOptionProps;
 * 
 * @comments ひとつのアルバムの変数
 * @typedef {{
 *  dir?: string;
 *  name: string;
 *  list: MediaImageItemProps[];
 *  [key: string]: any;
 * }} MediaImageAlbumProps;
 * 
 * @comments ひとつの画像用の変数
 * @typedef {{
 *  name: string;
 *  src: string;
 *  dir?: string;
 *  fullPath?: string;
 *  tags?: string[];
 *  group?: string;
 *  title?: string;
 *  description?: string;
 *  time?: number | Date;
 *  timeFormat?: string;
 *  timeReplace?: string;
 *  topImage?: boolean;
 *  [key: string]: any;
 *  info?: MediaImageInfoProps;
 *  resized?: {
 *   src: string;
 *   option: ResizeOptionProps;
 *  }[]
 * }} MediaImageItemProps;
 * 
 * @comments 画像そのもののプロパティ
 * @typedef {{
 *  width: number;
 *  height: number;
 *  type: string;
 *  wide: boolean;
 * }} MediaImageInfoProps;
*/

/**
 * @summary デフォルトで画像ディレクトリ、サムネイルサイズでリサイズ
 * @type {MediaImageDirProps[]}
 * */
const readDirList = [
  { path: "../media/data/gallery", yaml: true, resizeOption: { mode: 'thumbnail', fit: 'outside' } },
  { path: "icons", recursive: true, resizeOption: { mode: 'icon' } },
  { path: "character/images", resizeOption: { mode: 'thumbnail' } },
  { path: "character/icons", name: "charaIcon", resizeOption: { mode: "icon" } },
]

// publicディレクトリのみを対象にする
const workDir = `${process.env.PWD}`, publicDir = `${process.env.PUBLIC_DIR}`, resizedDir = `${process.env.RESIZED_DIR}`;
const imageRe = /\.(png|jpe?g|gif)$/i;

/**
 * @summary 参照渡しで加工する関数
 * @param {MediaImageItemProps} image
 * @param {MediaImageDirProps} dirItem
 * @param {getImageListProps} getImageOption[]
 */
function readImage(image, dirItem, getImageOption = {}) {
  image.imageUrl = `/${image.dir}/${image.src}`;
  image.fullPath = `${workDir}/${publicDir}${image.imageUrl}`;
  const dimensions = sizeOf(image.fullPath);
  const width = Number(dimensions.width);
  const height = Number(dimensions.height);
  image.info = { width, height, type: `${dimensions.type}`, wide: width > height }
  if (imageRe.test(image.src)) {
    const resizeOptions = dirItem.resizeOption ? (Array.isArray(dirItem.resizeOption) ? dirItem.resizeOption : [dirItem.resizeOption]) : [];
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
      const resuzedBase = resizeOption.ext ? image.imageUrl.replace(/[^\.]+$/, resizeOption.ext) : image.imageUrl;
      const resizedUrl = `/${resizedDir}/${resizeOption.mode}${resuzedBase}`;
      const resizedFullPath = `${workDir}/${publicDir}${resizedUrl}`;
      if (getImageOption.doRetouch) RetouchImage({ ...{ src: `${image.fullPath}`, output: resizedFullPath }, ...resizeOption });
      if (!image.resized) image.resized = [];
      image.resized.push({ src: resizedUrl, option: resizeOption });
    });
  }
  return image;
}

/**
 * @typedef {{ albumName?: string; imageName?: string; tagName?: string, pathMatch?: string | RegExp, topImage?: boolean }} FilterOptionProps;
 * @typedef {{ filter?: FilterOptionProps | string; doRetouch?: boolean; onceAlbum?: boolean; onceImage?: boolean; }} getImageListProps;
 * @param {getImageListProps | string} [getImageOptionArgs];
 * @returns {MediaImageAlbumProps[]};
 */
export function getImageAlbums(getImageOptionArgs = {}) {
  const getImageOption = (typeof (getImageOptionArgs) === "string") ? { filter: { albumName: getImageOptionArgs } } : getImageOptionArgs;
  /** @type FilterOptionProps */
  const filter = ((typeof (getImageOption.filter) === "string") ? { albumName: getImageOption.filter } : getImageOption.filter) || {};
  const onceAlbum = getImageOption.onceAlbum || false;
  const onceImage = getImageOption.onceImage || false;

  /** @type MediaImageAlbumProps[] */
  const allResult = [];

  readDirList.some(
    (dirItem) => {
      const dirName = dirItem.name || path.parse(dirItem.path).name;
      if (!dirItem.yaml && filter.albumName && filter.albumName !== dirName) return null;
      /** @type MediaImageAlbumProps | null */
      const dirAlbum = dirItem.yaml ? null : {
        dir: dirItem.path,
        name: dirName,
        list: []
      };

      /** @param {string} dir */
      const itemFor = (dir) => {
        const itemFullDir = `${workDir}/${publicDir}/${dir}`;
        fs.readdirSync(itemFullDir).some((childName) => {
          const parsedPath = path.parse(childName);
          if (parsedPath.ext === "") {
            if (dirItem.recursive) itemFor(`${dir}/${childName}`)
          } else {
            if (/\.ya?ml/i.test(parsedPath.ext)) {
              if (dirItem.yaml && (!filter.albumName || filter.albumName === parsedPath.name)) {
                /** @type MediaImageAlbumProps */
                // @ts-ignore
                const album = load(String(fs.readFileSync(`${itemFullDir}/${childName}`, "utf8")));
                album.list = album.list.filter((item) => {
                  if (filter.imageName && filter.imageName !== item.name) return false;
                  if (filter.tagName && item.tags && !item.tags.some(tag => tag === filter.tagName)) return false;
                  if (filter.topImage && !item.topImage) return false;
                  item.dir = album.dir || '';
                  if (filter.pathMatch && !`/${item.dir}/${item.src}`.match(filter.pathMatch)) return false;
                  readImage(item, dirItem, getImageOption);
                  return true;
                });
                if (onceImage && album.list.length > 0) album.list = [album.list[0]];
                if (album.list.length > 0) allResult.push(album)
              }
            } else {
              if (dirAlbum !== null && !filter.tagName) {
                if (imageRe.test(parsedPath.ext)) {
                  if (filter.imageName && filter.imageName !== parsedPath.name) return false;
                  if (filter.pathMatch && !`/${dir}/${childName}`.match(filter.pathMatch)) return false;
                  dirAlbum.list.push(readImage({ name: parsedPath.name, src: childName, dir: dir }, dirItem, getImageOption))
                }
              }
            }
          }
          if ((onceAlbum || onceImage) && allResult.length > 0) return true
          else if (onceImage && dirAlbum !== null && dirAlbum.list.length > 0) return true;
        });
      }
      itemFor(dirItem.path);
      if (dirAlbum !== null && dirAlbum.list.length > 0) allResult.push(dirAlbum);
      if ((onceAlbum || onceImage) && allResult.length > 0) return true;
    }
  )
  return allResult;
}

/**
 * @param {getImageListProps | string} [getImageOption];
 * @returns {MediaImageAlbumProps | null};
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
 * @param {getImageListProps | string} [getImageOption];
 * @returns {MediaImageItemProps[]};
 */
export function getImageItems(getImageOption = {}) {
  if (typeof (getImageOption) === "string") getImageOption = { filter: { imageName: getImageOption } }
  const albums = getImageAlbums(getImageOption);
  /** @type {MediaImageItemProps[]} */
  const imageList = [];
  albums.forEach((album => {
    album.list.forEach(item => {
      item.group = album.name;
      imageList.push(item);
    })
  }))
  return imageList;
}

/**
 * @param {getImageListProps | string} [getImageOption];
 * @returns {MediaImageItemProps | null};
 */
export function getImageItem(getImageOption = {}) {
  if (typeof (getImageOption) === "string") getImageOption = { filter: { imageName: getImageOption } }
  const images = getImageItems({ ...getImageOption, ...{ onceAlbum: true } });
  if (images.length > 0)
    return images[0];
  else
    return null;
}

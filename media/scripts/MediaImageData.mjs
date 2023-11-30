"use strict";

import dotenv from 'dotenv';
if (!process.env.PUBLIC_DIR) dotenv.config();
import sizeOf from "image-size"

import fs from "fs"
import path from "path"
import { load } from "js-yaml";
import MakeResize from "./MakeResize.mjs"

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
 * 
 * @typedef {{
 *  mode?: ResizeMode
 *  ext?: string
 *  size?: number
 *  width?: number
 *  height?: number
 *  quality?: number
 *  method?: ("outside" | "cover" | "contain" | "scaleToFit")
 * }} ResizeOptionProps
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
  { path: "../media/data/gallery", yaml: true, resizeOption: { mode: 'thumbnail' } },
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
 * @param {MediaImageDirProps} [dirItem]
 * @param {getImageListProps} [args]
 */
function readImage(image, dirItem = {}, args = {}) {
  image.imageUrl = `/${image.dir}/${image.src}`;
  image.fullPath = `${workDir}/${publicDir}${image.imageUrl}`;
  const dimensions = sizeOf(image.fullPath);
  const width = Number(dimensions.width);
  const height = Number(dimensions.height);
  image.info = { width, height, type: `${dimensions.type}`, wide: width > height }
  if (imageRe.test(image.src)) {
    const resizeOptions = dirItem.resizeOption ? (Array.isArray(dirItem.resizeOption) ? dirItem.resizeOption : [dirItem.resizeOption]) : [];
    if (!image.resized) image.resized = [];
    resizeOptions.forEach((v) => {
      const resizeOption = Object.assign({}, v);
      if (!resizeOption.mode) resizeOption.mode = "thumbnail";
      switch (resizeOption.mode) {
        case "icon":
          if (!resizeOption.size) resizeOption.size = 48;
          break;
        case "thumbnail":
          if (!resizeOption.size) resizeOption.size = 340;
          if (!resizeOption.quality) resizeOption.quality = 80;
          if (!resizeOption.ext) resizeOption.ext = "jpg"
          break;
      }
      const resuzedBase = resizeOption.ext ? image.imageUrl.replace(/[^\.]+$/, resizeOption.ext) : image.imageUrl;
      const resizedUrl = `/${resizedDir}/${resizeOption.mode}${resuzedBase}`;
      const resizedFullPath = `${workDir}/${publicDir}${resizedUrl}`;
      if (args.doResize) MakeResize({ ...{ src: image.fullPath, output: resizedFullPath }, ...resizeOption });
      image.resized.push({ src: resizedUrl, option: resizeOption });
    });
  }
  return image;
}

/**
 * @typedef {{ albumName?: string; imageName?: string; tagName?: string, pathMatch?: string | RegExp, topImage?: boolean }} FilterOptionProps;
 * @typedef {{ filter?: FilterOptionProps | string; doResize?: boolean; onceAlbum?: boolean; onceImage?: boolean; }} getImageListProps;
 * @param {getImageListProps | string} [args];
 * @returns {MediaImageAlbumProps[]};
 */
export function getImageAlbums(args = {}) {
  if (typeof (args) === "string") args = { filter: { albumName: args } }
  /** @type FilterOptionProps */
  const filter = ((typeof (args.filter) === "string") ? { albumName: args.filter } : args.filter) || {};

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
                const album = load(fs.readFileSync(`${itemFullDir}/${childName}`), "utf8");
                album.list = album.list.filter((item) => {
                  if (filter.imageName && filter.imageName !== item.name) return false;
                  if (filter.tagName && item.tags && !item.tags.some(tag => tag === filter.tagName)) return false;
                  if (filter.topImage && !item.topImage) return false;
                  item.dir = album.dir || '';
                  if (filter.pathMatch && !`/${item.dir}/${item.src}`.match(filter.pathMatch)) return false;
                  readImage(item, dirItem, args);
                  return true;
                });
                if (args.onceImage && album.list.length > 0) album.list = [album.list[0]];
                if (album.list.length > 0) allResult.push(album)
              }
            } else {
              if (dirAlbum !== null && !filter.tagName) {
                if (imageRe.test(parsedPath.ext)) {
                  if (filter.imageName && filter.imageName !== parsedPath.name) return false;
                  if (filter.pathMatch && !`/${dir}/${childName}`.match(filter.pathMatch)) return false;
                  dirAlbum.list.push(readImage({ name: parsedPath.name, src: childName, dir: dir }, dirItem, args))
                }
              }
            }
          }
          if ((args.onceAlbum || args.onceImage) && allResult.length > 0) return true
          else if (args.onceImage && dirAlbum !== null && dirAlbum.list.length > 0) return true;
        });
      }
      itemFor(dirItem.path);
      if (dirAlbum !== null && dirAlbum.list.length > 0) allResult.push(dirAlbum);
      if ((args.onceAlbum || args.onceImage) && allResult.length > 0) return true;
    }
  )
  return allResult;
}

/**
 * @param {getImageListProps | string} [args];
 * @returns {MediaImageAlbumProps | null};
 */
export function getImageAlbum(args = {}) {
  const albums = getImageAlbums({ ...args, ...{ onceAlbum: true } });
  if (albums.length > 0)
    return albums[0];
  else
    return null;
}


/**
 * @param {getImageListProps | string} [args];
 * @returns {MediaImageItemProps[]};
 */
export function getImageItems(args = {}) {
  const albums = getImageAlbums(args);
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
 * @param {getImageListProps | string} [args];
 * @returns {MediaImageItemProps | null};
 */
export function getImageItem(args = {}) {
  const images = getImageItems({ ...args, ...{ onceAlbum: true } });
  if (images.length > 0)
    return images[0];
  else
    return null;
}

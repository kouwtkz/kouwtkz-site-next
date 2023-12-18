// @ts-check

import dotenv from 'dotenv';
if (!process.env.PUBLIC_DIR) dotenv.config();
import sizeOf from "image-size"

import fs from "fs"
import path from "path"
import { parse } from "yaml";
import RetouchImage from "./RetouchImage.mjs"

const isStatic = process.env.OUTPUT_MODE === 'export';

const projectRoot = process.cwd(), publicDir = process.env.PUBLIC_DIR || '', publicRoot = `${projectRoot}/${publicDir}`;
const mediaDir = process.env.MEDIA_DIR || '', mediaRoot = `${publicRoot}/${mediaDir}`;
const dataDir = `${process.env.DATA_DIR}`, mediaDataDir = `${dataDir}/media`;

const mediaHostPath = process.env.MEDIA_HOST_PATH || mediaDir;
const sMediaHostPath = `/${mediaHostPath ? mediaHostPath : process.env.MEDIA_DIR}`;
const innerHost = `${isStatic ? '' : process.env.MEDIA_HOST_CONTAINER || ''}${sMediaHostPath}`;
const imageHost = `${process.env.MEDIA_HOST_PUBLIC || ''}${sMediaHostPath}`;

const resizedDir = `${process.env.RESIZED_DIR}`, resizedURLRoot = `${mediaHostPath ? `${mediaHostPath}/` : ''}${resizedDir}`, resizedFullDir = `${mediaRoot}/${resizedDir}`;
const defaultImageRoot = mediaRoot;

import imageDirList from "../../../_data/image/imageDirList.mjs"

const imageRe = /\.(png|jpe?g|gif)$/i;

/**
 * @summary 参照渡しで加工する関数
 * @param {MediaImageItemType & {time?: any}} image
 * @param {MediaImageDirType} dirItem
 * @param {getImageListType} getImageOption[]
 */
function readImage(image, dirItem, getImageOption = {}) {
  const imagePath = `/${image.dir}/${image.src}`;
  image.path = `${sMediaHostPath}${imagePath}`;
  image.URL = `${imageHost}${imagePath}`;
  image.innerURL = `${innerHost}${imagePath}`;
  const fullPath = `${dirItem.imageRoot || projectRoot}${imagePath}`;
  image.time = image.time ? image.time : (image.time === null ? null : new Date(fs.statSync(fullPath).mtime));
  const dimensions = sizeOf(fullPath);
  const width = Number(dimensions.width);
  const height = Number(dimensions.height);
  image.info = { width, height, type: `${dimensions.type}`, wide: width > height }
  if (/\.svg$/i.test(image.src)) {
    image.innerURL = `${sMediaHostPath}${imagePath}`;
  } else if (imageRe.test(image.src)) {
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
      const resizedBase = resizeOption.ext ? imagePath?.replace(/[^\.]+$/, resizeOption.ext) : imagePath;
      const resizedUrl = `/${resizedURLRoot}/${resizeOption.mode}${resizedBase}`;
      const resizedFullPath = `${resizedFullDir}/${resizeOption.mode}${resizedBase}`;
      if (getImageOption.doRetouch) RetouchImage({ ...{ src: `${fullPath}`, output: resizedFullPath }, ...resizeOption });
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

  imageDirList.some(
    (dirItem) => {
      const dirName = dirItem.name || path.parse(dirItem.path).name;
      const dirRoot = dirItem.root ? dirItem.root : defaultImageRoot;

      if (!dirItem.yaml && filterAlbumNames.length > 0 && !filterAlbumNames.some(fname => fname === dirName)) return null;
      if (!dirItem.imageRoot) dirItem.imageRoot = defaultImageRoot;
      /** @type MediaImageAlbumType | null */
      const dirAlbum = dirItem.yaml ? null : {
        dir: dirItem.path,
        name: dirName,
        list: []
      };

      /** @param {string} dir */
      const itemFor = (dir) => {
        const itemFullDir = `${dirRoot}/${dir}`;
        fs.readdirSync(itemFullDir).some((childName) => {
          const parsedPath = path.parse(childName);
          if (parsedPath.ext === "") {
            if (dirItem.recursive) itemFor(`${dir}/${childName}`)
          } else {
            if (/\.ya?ml/i.test(parsedPath.ext)) {
              if (dirItem.yaml && (filterAlbumNames.length === 0 || filterAlbumNames.some(fname => fname === parsedPath.name))) {
                /** @type MediaImageAlbumType */
                // @ts-ignore
                const album = parse(String(fs.readFileSync(`${itemFullDir}/${childName}`, "utf8")));
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
                  if (filter.topImage) return false;
                  dirAlbum.list.push(readImage({ name: parsedPath.name, src: childName, dir: dir }, dirItem, getImageOption))
                }
              }
            }
          }
          if ((onceAlbum || onceImage) && allResult.length > 0) return true
          else if (onceImage && dirAlbum !== null && dirAlbum.list.length > 0) return true;
        });
      }
      try {
        itemFor(dirItem.path);
      } catch (e) {
        // ここのエラーは定義したメディアのディレクトリがないときに出る
        console.error(e);
      }
      if (dirAlbum !== null && dirAlbum.list.length > 0) allResult.push(dirAlbum);
      if ((onceAlbum || onceImage) && allResult.length > 0) return true;
    }
  )
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
      item.group = album.name;
      imageList.push(item);
    })
  }))
  return imageList;
}

/**
 * @typedef { import("./MediaImageType.d.ts").getImageListType } getImageListType
 * @typedef { import("./MediaImageType.d.ts").MediaImageDirType } MediaImageDirType
 * @typedef { import("./MediaImageType.d.ts").ResizeMode } ResizeMode
 * @typedef { import("./MediaImageType.d.ts").FitMethod } FitMethod
 * 
 * @typedef { import("./MediaImageType.d.ts").ResizeOptionType } ResizeOptionType
 * @typedef { import("./MediaImageType.d.ts").MediaImageAlbumType } MediaImageAlbumType
 * @typedef { import("./MediaImageType.d.ts").MediaImageItemType } MediaImageItemType
 * @typedef { import("./MediaImageType.d.ts").MediaImageInfoType } MediaImageInfoType
 * 
*/

import { ResizeMode, ResizeOptionType } from "./MediaImageYamlType";

export type getImageListType = {
  filter?: string | FilterOptionProps;
  doMakeImage?: boolean;
  onceAlbum?: boolean;
  onceImage?: boolean;
}

/** @comments ひとつのアルバムの変数 */
export type MediaImageAlbumType = {
  dir?: string;
  name: string;
  group?: string;
  listup?: boolean;
  link?: string;
  time?: Date | null;
  description?: string;
  visible?: AlbumVisibleType;
  list: MediaImageItemType[];
}

export type AlbumVisibleType = { info?: boolean, title?: boolean, filename?: boolean };
export type ResizedType = { src: string, mode: ResizeMode };

/** @comments ひとつの画像用の変数 */
export type MediaImageItemType = {
  name: string;
  src: string;
  dir?: string;
  path?: string;
  link?: string;
  direct?: string;
  URL?: string;
  tags?: string[];
  description?: string;
  embed?: string;
  copyright?: string;
  time?: Date | null;
  timeOptions?: Intl.DateTimeFormatOptions;
  topImage?: boolean | null;
  pickup?: boolean | null;
  tool?: string | string[];
  resizeOption?: ResizeOptionType | ResizeOptionType[];
  resized?: ResizedType[]
  album?: MediaImageAlbumType;
  fullPath?: string;
  mtime?: Date;
  origin?: string;
  [name: string]: any;
}

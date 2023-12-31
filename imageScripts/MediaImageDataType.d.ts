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
  fanart?: boolean;
  collaboration?: boolean;
  copyright?: string | boolean;
  time?: Date | null;
  timeOptions?: Intl.DateTimeFormatOptions;
  topImage?: boolean;
  info?: MediaImageInfoType;
  resizeOption?: ResizeOptionType | ResizeOptionType[];
  resized?: ResizedType[]
  album?: MediaImageAlbumType;
  fullPath?: string;
  mtime?: Date;
  title?: string; // 互換用、nameに統一することにした
}

export type MediaImageInfoType = {
  width: number;
  height: number;
  type: string;
  wide: boolean;
}

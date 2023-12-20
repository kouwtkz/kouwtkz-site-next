export type getImageListType = {
  filter?: string | FilterOptionProps;
  doRetouch?: boolean;
  onceAlbum?: boolean;
  onceImage?: boolean;
}

export type ResizeMode = "icon" | "thumbnail" | "simple";

export type FitMethod = "fill" | "contain" | "cover" | "outside" | "inside";

/** @comments ディレクトリ指定のオプション */
export type MediaImageDirType = {
  path: string;
  root?: string;
  yaml?: boolean;
  imageRoot?: string;
  name?: string;
  recursive?: boolean;
  resizeOption?: ResizeOptionType | ResizeOptionType[];
}

export type ResizeOptionType = {
  mode?: ResizeMode;
  ext?: string;
  size?: number | {
    w: number;
    h: number;
  };
  quality?: number;
  fit?: FitMethod;
}

/** @comments ひとつのアルバムの変数 */
export type MediaImageAlbumType = {
  [key: string]: any;
  dir?: string;
  name: string;
  visible?: { info?: boolean, title?: boolean, filename?: boolean };
  list: MediaImageItemType[];
}

/** @comments ひとつの画像用の変数 */
export type MediaImageItemType = {
  name: string;
  src: string;
  dir?: string;
  path?: string;
  link?: string;
  URL?: string;
  innerURL?: string;
  tags?: string[];
  title?: string;
  description?: string;
  time?: Date | null;
  timeOptions?: Intl.DateTimeFormatOptions;
  topImage?: boolean;
  [key: string]: any;
  info?: MediaImageInfoType;
  resized?: {
    src: string;
    option: ResizeOptionType;
  }[]
  album?: MediaImageAlbumType;
}

export type MediaImageInfoType = {
  width: number;
  height: number;
  type: string;
  wide: boolean;
}
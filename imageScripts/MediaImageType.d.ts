export type getImageListType = {
  filter?: string | FilterOptionProps;
  doMakeImage?: boolean;
  onceAlbum?: boolean;
  onceImage?: boolean;
}

export type ResizeMode = "icon" | "thumbnail" | "simple";

export type FitMethod = "fill" | "contain" | "cover" | "outside" | "inside";

/** @comments ディレクトリ指定のオプション */
export type MediaImageGroupsType = {
  path: string;
  yaml?: boolean;
  name?: string;
  tags?: string[];
  format?: "image" | "comic";
  recursive?: boolean;
  output?: {
    get?: boolean; // Jsonとかで使うかどうか
    webp?: boolean;
    time?: boolean;
    info?: boolean;
  }
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
  dir?: string;
  name: string;
  group?: string;
  link?: string;  
  time?: Date | null;
  description?: string;  
  visible?: { info?: boolean, title?: boolean, filename?: boolean };
  list: MediaImageItemType[];
  odd?: boolean;
}

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
  title?: string;
  description?: string;
  time?: Date | null;
  timeOptions?: Intl.DateTimeFormatOptions;
  topImage?: boolean;
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
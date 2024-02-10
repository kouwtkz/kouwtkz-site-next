import { MediaImageItemType, AlbumVisibleType } from "./MediaImageDataType";

export interface YamlDataImageType extends MediaImageItemType {
  time?: string;
}

export type GroupFormat = "image" | "comic";
export type ResizeMode = "icon" | "thumbnail" | "simple";
export type FitMethod = "fill" | "contain" | "cover" | "outside" | "inside";

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

export type YamlDataType = {
  recursive?: boolean;
  listup?: boolean;
  name?: string;
  description?: string;
  visible?: AlbumVisibleType;
  auto?: null | "year"
  copyright?: string;
  format?: GroupFormat;
  time?: string;
  list?: YamlDataImageType[];
  notfound?: YamlDataImageType[];
  output?: OutputOptionType;
  resizeOption?: ResizeOptionType | ResizeOptionType[];
}

export type YamlGroupType = {
  name: string;
  from: string;
  to?: string;
  dir: string;
  data: YamlDataType;
  list: YamlDataImageType[];
  already: boolean;
  mtime?: Date;
};

export type GetYamlImageFilterType = {
  path?: string | RegExp;
  group?: string[] | string | RegExp;
  tags?: string[] | string;
  topImage?: boolean;
  archive?: boolean;
  listup?: boolean;
  endsWith?: boolean;
}

export type GetYamlImageListProps = {
  from: string;
  /**
   * @default path
   * @augments `${publicDir}/${to}`
   */
  to?: string;
  /** @default "public" */
  publicDir?: string;
  selfRoot?: boolean;
  filter?: GetYamlImageFilterType;
  readImage?: boolean;
  makeImage?: boolean;
  deleteImage?: boolean;
  /** @default false */
  readSize?: boolean;
}

export interface UpdateImageYamlProps extends GetYamlImageListProps {
  yamls?: YamlGroupType[]
}

export type OutputOptionType = {
  get?: boolean; // Jsonとかで使うかどうか
  webp?: boolean;
  time?: boolean;
  info?: boolean;
}

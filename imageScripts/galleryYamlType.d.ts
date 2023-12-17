// yamlマップデータ用のタイプ

import { Dirent } from "fs"

export type YamlList = {
  src: string
  title: string
  description: string
  tags: Array<string>
  time: number
  dir?: string
  mtime?: any
  exist?: boolean
  index?: number
}

export type YamlData = {
  list: Array<YamlList>
  path?: string
  title?: string
  name?: string
  description?: string
}

export type YamlObject = {
  path: string
  data: YamlData
  mtime: number
}

export interface PlusDirEntry extends Dirent {
  dir: string;
  mtime: Date;
};

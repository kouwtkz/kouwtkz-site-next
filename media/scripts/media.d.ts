export interface ImageMapGroup extends Map<string, ImageDataObject> { }
export interface ImageDataGroup {
  [name: string]: ImageDataObject
}
export interface ImageMapList extends Map<string, ImageDataInfo> { }
export interface ImageGroupOptions {
  thumbnail?: boolean
  icon?: boolean
}
export interface ImageDataObject {
  list: Array<ImageDataInfo>
  title?: string
  name?: string
  description?: string
  dir?: string
  share?: string
  timeFormat?: string
  timeReplace?: string
  absolutePath?:string
  imageGroupOptions?: ImageGroupOptions
}
export interface ImageSize {
  width: number
  height: number
  type: string
  wide: boolean
}
export interface ImageDataInfo {
  src: string
  path?: string
  title?: string
  name?: string
  description?: string
  tags?: Array<string>
  time?: number | Date
  link?: string
  dir?: string
  imageUrl?: string
  fullPath?: string
  group?: string
  share?: string
  timeFormat?: string
  timeReplace?: string
  topImage?: boolean
  thumbnail?: string
  icon?: string
  info?: ImageSize
}

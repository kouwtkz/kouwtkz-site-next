export interface ImageMapGroup extends Map<string, ImageDataObject> { }
export interface ImageDataGroup {
  [name: string]: ImageDataObject
}
export interface ImageMapList extends Map<string, ImageDataInfo> { }
export interface ImageDataObject {
  list: Array<ImageDataInfo>
  gallery?: string
  title?: string
  name?: string
  description?: string
  path?: string
  share?: string
  timeFormat?: string
  timeReplace?: string
  absolutePath?:string
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
  title: string
  name?: string
  description: string
  tags: Array<string>
  time: number | Date
  link?: string
  dir?: string
  baseUrl?: string
  imageUrl?: string
  fullPath?: string
  group?: string
  share?: string
  timeFormat?: string
  timeReplace?: string
  thumbnail?: string
  topImage?: boolean
  size?: ImageSize
}
export interface SoundData {
  title: string
  path: string
  name: string
  albums: Array<SoundAlbumData>
  setupSound?: string
}
export interface SoundAlbumData {
  title: string
  list: Array<SoundItemData>
}
export interface SoundItemData {
  src: string
  title: string
  setup?: boolean
}
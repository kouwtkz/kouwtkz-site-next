import { GalleryItemType } from "../gallery/GalleryObject"

type SiteProps = {
  title: string
  description: string
  short: { description: string }
  image: string
  author: SiteAuthorProps
  manifest: any
  enableEmoji?: boolean
  enableRobotsTXT?: boolean
  menu?: {
    nav?: SiteMenuProps[],
    sns?: SiteSnsProps[],
  }
  gallery?: {
    default?: GalleryItemType[]
    generate?: GalleryItemType[]
  }
}

export type SiteAuthorProps = {
  name: string
  account: string
  ename: string
  mail: string
  smail: string
  since: number
  x:
  {
    [name: string]: string
  }
}

export type SiteMenuProps = {
  name: string
  url: string
}

export type SiteSnsProps = {
  name: string
  url: string
  title?: string
  mask?: string
  image?: string
  row?: number
  rel?: string
  hidden?: boolean
  none?: boolean
}
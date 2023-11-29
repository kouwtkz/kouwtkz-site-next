export interface SiteProps {
  title: string
  description: string
  short: {
    description: string
  }
  author: SiteAuthorProps
  manifest: any
  enableEmoji?: boolean
  enableRobotsTXT?: boolean
  menu?: {
    nav?: Array<SiteMenuProps>,
    sns?: Array<SiteSnsProps>,
  }
}

export interface SiteAuthorProps {
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

export interface SiteMenuProps {
  name: string
  url: string
}
export interface SiteSnsProps {
  name: string
  url: string
  title?: string
  mask?: string
  image?: string
  row?: number
  rel?: string
}
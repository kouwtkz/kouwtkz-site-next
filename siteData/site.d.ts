export default interface siteProp {
  title: string
  description: string
  short: {
    description: string
  }
  author: {
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
  manifest: any
  enableEmoji?: boolean
  enableRobotsTXT?: boolean
}

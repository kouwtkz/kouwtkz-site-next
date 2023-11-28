
export interface CharaProp {
  name: string,
  honorific?: string,
  description?: string,
  path?: string,
  icon?: string,
  image?: string,
  headerImage?: string,
  playlist?: [string] | string,
  time?: Date,
}

export interface CharaListProp {
  [name: string]: CharaProp
}

export interface CharaProp {
  name: string,
  honorific?: string,
  description?: string,
  path?: string,
  icon?: string
}

export interface CharaListProp {
  [name: string]: CharaProp
}

export interface CharaProps {
  id?: string
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

export interface CharaListProps {
  [name: string]: CharaProps
}
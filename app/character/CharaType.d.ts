
import { MediaImageItemType } from "@/MediaScripts/MediaImageDataType";
import { PlaylistType } from "../sound/MediaSoundType";
import { ReactNode } from "react";

export interface CharaType {
  id?: string
  name: string,
  honorific?: string,
  description?: string,
  path?: string,
  icon?: string,
  image?: string,
  time?: Date,
  headerImage?: string,
  embed?: string | string[],
  playlist?: PlaylistType,
  media?: {
    icon?: MediaImageItemType | null,
    image?: MediaImageItemType | null,
    headerImage?: MediaImageItemType | null,
  }
}

export interface CharaObjectType {
  [name: string]: CharaType
}
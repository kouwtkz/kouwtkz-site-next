
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { PlaylistType } from "../sound/MediaSoundType";
import { ReactNode } from "react";

export interface CharaType {
  id: string
  name: string,
  honorific?: string,
  defEmoji?: string,
  overview?: string,
  description?: string,
  tags?: string[],
  path?: string,
  icon?: string,
  image?: string,
  time?: Date,
  headerImage?: string,
  embed?: string,
  playlist?: string[],
  media?: {
    icon?: MediaImageItemType | null,
    image?: MediaImageItemType | null,
    headerImage?: MediaImageItemType | null,
    playlist?: PlaylistType,
  },
  [k: string]: any
}

export interface CharaObjectType {
  [name: string]: CharaType
}
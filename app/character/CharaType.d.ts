
import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
import { PlaylistType } from "../sound/MediaSoundType";
import { ReactNode } from "react";
import { EmbedTextType } from "../context/embed/EmbedState";

export interface CharaType {
  id?: string
  name: string,
  honorific?: string,
  defEmoji?: string,
  description?: string,
  path?: string,
  icon?: string,
  image?: string,
  time?: Date,
  headerImage?: string,
  embed?: EmbedTextType,
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
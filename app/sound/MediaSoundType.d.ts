export type SoundAlbumType = {
  title: string;
  src: string;
  name: string;
  playlist?: PlaylistType[];
  setupSound?: string
}

export type PlaylistType = {
  title?: string;
  list: SoundItemType[];
}

export type SoundItemType = {
  src: string;
  title: string;
}

export type LoopMode = "off" | "loop" | "loopOne" | "playUntilEnd";
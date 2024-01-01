// @ts-check

/**
 * @typedef { import("./MediaSoundType").SoundAlbumType } SoundAlbumType
 * @typedef { import("./MediaSoundType").PlaylistType } PlaylistType
 * @typedef { import("./MediaSoundType").SoundItemType } SoundItemType
 */

import { readFileSync } from "fs";
import { parse } from "yaml";
const cwd = process.cwd();
const dataDir = `${process.env.DATA_DIR || '_data'}`;
const defaultSoundDir = `/sound`;

const readYamlList = [`${dataDir}/sound.yaml`];
export function ReadSoundDataFromYaml() {
  /** @type SoundAlbumType[] */
  const AlbumList = [];
  readYamlList.forEach((yamlItem) => {
    /** @type SoundAlbumType */
    // @ts-ignore
    const album = parse(String(readFileSync(`${cwd}/${yamlItem}`, "utf8")));
    album.playlist?.forEach(sounds => { sounds.list.forEach((sound) => { sound.src = `${album.dir || defaultSoundDir}/${sound.src}` }) })
    AlbumList.push(album);
  })
  return AlbumList;
}

const soundAlbums = ReadSoundDataFromYaml();
export { soundAlbums };

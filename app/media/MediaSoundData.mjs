// @ts-check

/**
 * @typedef {{
 * title: string;
 * src: string;
 * name: string;
 * playlist?: PlaylistType[];
 * setupSound?: string
 * }} SoundAlbumType;
 * @typedef {{
 * title?: string;
 * list: SoundItemType[];
 * }} PlaylistType;
 * @typedef {{
 * src: string;
 * title: string;
 * list: [];
 * }} SoundItemType;
 */

import { readFileSync } from "fs";
import { load } from "js-yaml";
const projectRoot = `${process.env.PWD}`;
const mediaHostPath = `${process.env.MEDIA_HOST_PATH}`;
const dataDir = `${process.env.DATA_DIR}`, mediaDataDir = `${dataDir}/media`;
const defaultSoundPath = `${mediaHostPath ? `/${mediaHostPath}` : ''}/sound`;

const readYamlList = [`${mediaDataDir}/sound.yaml`];
export function ReadSoundDataFromYaml() {
  /** @type SoundAlbumType[] */
  const AlbumList = [];
  readYamlList.forEach((yamlItem) => {
    /** @type SoundAlbumType */
    // @ts-ignore
    const album = load(String(readFileSync(`${projectRoot}/${yamlItem}`, "utf8")));
    album.playlist?.forEach(sounds => { sounds.list.forEach((sound) => { sound.src = `${defaultSoundPath}/${sound.src}` }) })
    AlbumList.push(album);
  })
  return AlbumList;
}

const soundAlbums = ReadSoundDataFromYaml();
export { soundAlbums };

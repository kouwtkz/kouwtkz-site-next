// @ts-check

/**
 * @typedef {{
 * title: string;
 * src: string;
 * name: string;
 * playlist?: PlaylistProps[];
 * setupSound?: string
 * }} SoundAlbumProps;
 * @typedef {{
 * title?: string;
 * list: SoundItemProps[];
 * }} PlaylistProps;
 * @typedef {{
 * src: string;
 * title: string;
 * list: [];
 * }} SoundItemProps;
 */

import { readFileSync } from "fs";
import { load } from "js-yaml";
const projectRoot = `${process.env.PWD}`;
const mediaHostPath = `${process.env.MEDIA_HOST_PATH}`;
const dataDir = `${process.env.DATA_DIR}`, mediaDataDir = `${dataDir}/media`;
const defaultSoundPath = `${mediaHostPath ? `/${mediaHostPath}` : ''}/sound`;

const readYamlList = [`${mediaDataDir}/sound.yaml`];
export function ReadSoundDataFromYaml() {
  /** @type SoundAlbumProps[] */
  const AlbumList = [];
  readYamlList.forEach((yamlItem) => {
    /** @type SoundAlbumProps */
    // @ts-ignore
    const album = load(String(readFileSync(`${projectRoot}/${yamlItem}`, "utf8")));
    album.playlist?.forEach(sounds => { sounds.list.forEach((sound) => { sound.src = `${defaultSoundPath}/${sound.src}` }) })
    AlbumList.push(album);
  })
  return AlbumList;
}

const soundAlbums = ReadSoundDataFromYaml();
export { soundAlbums };

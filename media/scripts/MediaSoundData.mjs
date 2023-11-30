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
const workDir = `${process.env.PWD}`, publicDir = `${process.env.PUBLIC_DIR}`;

const readYamlList = ["media/data/sound.yaml"];
/** @param {string} path; */
export function ReadSoundDataFromYaml() {
  /** @type SoundAlbumProps[] */
  const AlbumList = [];
  readYamlList.forEach((yamlItem) => {
    /** @type SoundAlbumProps */
    const album = load(readFileSync(`${workDir}/${yamlItem}`), "utf8");
    album.playlist?.forEach(sound => { sound.src = `/sound/${sound.src}` })
    AlbumList.push(album);
  })
  return AlbumList;
}

const soundAlbums = ReadSoundDataFromYaml();
export { soundAlbums };

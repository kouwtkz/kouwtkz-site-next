// @ts-check

/**
 * @typedef { import("./MediaSoundType").SoundAlbumType } SoundAlbumType
 * @typedef { import("./MediaSoundType").PlaylistType } PlaylistType
 * @typedef { import("./MediaSoundType").SoundItemType } SoundItemType
 */

import { readFileSync } from "fs";
import { parse } from "yaml";
export const yamlPath = `_data/sound/_data.yaml`;
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

const outputSoundDir = `/sound`;

/** @type SoundAlbumType */
const soundAlbum = parse(String(readFileSync(`${cwd}/${yamlPath}`, "utf8")));
soundAlbum.playlist?.forEach(sounds => { sounds.list.forEach((sound) => { sound.src = `${soundAlbum.dir || outputSoundDir}/${sound.src}` }) })
export { soundAlbum };

// @ts-check

import { GetMediaImages, GetMediaImageAlbums } from "./YamlImageFunctions.mjs";

// yamlを管理するメディアディレクトリ
const mediaDir = "_media";
const images = GetMediaImages({ path: mediaDir, filter: { topImage: true, archive: false } });
console.log(images);

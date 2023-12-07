const dataDir = `${process.env.DATA_DIR}`;
/**
 * @summary デフォルトで画像ディレクトリ、サムネイルサイズでリサイズ
 * @type {import("../../app/media/image/MediaImageData.mjs").MediaImageDirType[]}
 * */
const imageDirList = [
  { path: 'gallery', root: `${dataDir}/image`, yaml: true, resizeOption: { mode: 'thumbnail', fit: 'outside' } },
  { path: 'icons', recursive: true, resizeOption: { mode: 'icon' } },
  { path: 'character/images', name: "charaImages", resizeOption: { mode: 'thumbnail' } },
  { path: 'character/icons', name: 'charaIcon', resizeOption: { mode: 'icon' } },
]

export default imageDirList;
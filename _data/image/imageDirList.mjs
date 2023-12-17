/**
 * @summary デフォルトで画像ディレクトリ、サムネイルサイズでリサイズ
 * @type {import("../../app/media/image/MediaImageType").MediaImageDirType[]}
 * */
const imageDirList = [
  { path: 'gallery', root: `_data/image`, yaml: true, resizeOption: { mode: 'thumbnail', fit: 'outside' } },
  { path: 'icons', recursive: true, resizeOption: { mode: 'icon' } },
  { path: 'character/images', name: "charaImages", resizeOption: { mode: 'thumbnail' } },
  { path: 'character/icons', name: 'charaIcon', resizeOption: { mode: 'icon' } },
]

export default imageDirList;
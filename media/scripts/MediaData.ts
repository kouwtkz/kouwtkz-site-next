import { setPath } from "@/app/functions/general";
import { ReadImageYamlGroupFromDir } from "./readMediaYaml";
import sizeOf from "image-size"
import { ImageDataInfo } from "./media";
import { readImagesDir } from "./readMediaDir"
import { isStatic } from "@/app/functions/general";
import fs from "fs"

const imageDataGroupMap = ReadImageYamlGroupFromDir("@/media/data/gallery", { thumbnail: true })

imageDataGroupMap.set("charaIcon", readImagesDir("@/public/character/icons", { icon: true }))

// writeFileSync(setPath(`@/${process.env.DICT_DIR}/neko.txt`), 'kawaii');

const publicDir = `${process.env.PUBLIC_DIR}`;
const resizedDir = `${process.env.RESIZED_DIR}`;

imageDataGroupMap.forEach((group) => {
  group.list.forEach((image) => {
    image.dir = `/${group.dir}`
    image.imageUrl = `${image.dir}/${image.src}`
    image.fullPath = setPath(`@/${publicDir}${image.imageUrl}`)
    const dimensions = sizeOf(image.fullPath)
    const width = <number>dimensions.width;
    const height = <number>dimensions.height;
    image.info = { width: width, height: height, type: <string>dimensions.type, wide: width > height };
  })
})

const imageDataGroup = Object.fromEntries(imageDataGroupMap);

const imageList = Object.entries(imageDataGroup).reduce((p, c) => [...p, ...c[1].list.map((e) => { return { ...e, group: c[0], base: c[1].dir } })], <Array<ImageDataInfo>>[])

// soundData.albums.forEach(album => album.list.forEach(sound => { sound.src = `/sound/${sound.src}` }))

export { imageDataGroupMap, imageDataGroup, imageList };

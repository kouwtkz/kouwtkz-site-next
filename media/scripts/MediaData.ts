import { setPath } from "@/app/functions/general";
import { ReadImageDataGroupFromDir, ReadSoundData } from "./readMediaYaml";
import sizeOf from "image-size"
import { ImageDataInfo } from "./media";

const imageDataGroupMap = ReadImageDataGroupFromDir("@/media/data/gallery/")

imageDataGroupMap.forEach((group) => {
  group.list.forEach((image) => {
    image.baseUrl = group.path + "/"
    image.imageUrl = image.baseUrl + image.src
    image.fullPath = setPath(`@/public${image.imageUrl}`)
    const dimensions = sizeOf(image.fullPath)
    const width = <number>dimensions.width;
    const height = <number>dimensions.height;
    image.size = { width: width, height: height, type: <string>dimensions.type, wide: width > height };
  })
})

const imageDataGroup = Object.fromEntries(imageDataGroupMap);

const imageList = Object.entries(imageDataGroup).reduce((p, c) => [...p, ...c[1].list.map((e) => { return { ...e, group: c[0], base: c[1].path } })], <Array<ImageDataInfo>>[])

const soundData = ReadSoundData("@/media/data/sound.yaml");
soundData.albums.forEach(album => album.list.forEach(sound => { sound.src = `/sound/${sound.src}` }))

export { imageDataGroupMap, imageDataGroup, imageList, soundData };

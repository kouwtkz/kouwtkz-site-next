import { setPath } from "@/app/functions/general";
import { ReadImageDataGroupFromDir } from "./readMediaYaml";
import sizeOf from "image-size"
import { ImageDataInfo } from "./media";

const imageDataGroupMap = ReadImageDataGroupFromDir("@/media/data/gallery/")

imageDataGroupMap.forEach((group) => {
  group.list.forEach((image) => {
    const path = setPath(`@/public${group.path}/${image.src}`);
    const dimensions = sizeOf(path)
    const width = <number>dimensions.width;
    const height = <number>dimensions.height;
    image.size = { width: width, height: height, type: <string>dimensions.type, wide: width > height };
  })
})

const imageDataGroup = Object.fromEntries(imageDataGroupMap);

const imageList = Object.entries(imageDataGroup).reduce((p, c) => [...p, ...c[1].list.map((e) => { return { ...e, group: c[0], base: c[1].path } })], <Array<ImageDataInfo>>[])

export { imageDataGroupMap, imageDataGroup, imageList };

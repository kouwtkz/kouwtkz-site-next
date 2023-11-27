import { ReadImageDataGroupFromDir, rootPath } from "./readMediaYaml";
import sizeOf from "image-size"
const imageDataGroupMap = ReadImageDataGroupFromDir("@/media/data/gallery/")

imageDataGroupMap.forEach((group) => {
  group.list.forEach((image) => {
    const path = `${rootPath}/public${group.path}/${image.src}`;
    const dimensions = sizeOf(path)
    const width = <number>dimensions.width;
    const height = <number>dimensions.height;
    image.size = { width: width, height: height, type: <string>dimensions.type, wide: width > height };
  })
})

export { imageDataGroupMap };

import { MediaImageItemType } from "@/mediaScripts/MediaImageDataType";
export const publicParam = { list: <Array<MediaImageItemType>>[] };
const currentTime = new Date();
const currentMonth = currentTime.getMonth() + 1;

export const filterMonthList = [
  { month: 1, tags: ["january", "winter"] },
  { month: 2, tags: ["february", "winter", "valentine"] },
  { month: 3, tags: ["march", "spring", "easter"] },
  { month: 4, tags: ["april", "spring", "easter"] },
  { month: 5, tags: ["may", "spring"] },
  { month: 6, tags: ["june", "rainy"] },
  { month: 7, tags: ["july", "summer"] },
  { month: 8, tags: ["august", "summer"] },
  { month: 9, tags: ["september", "autumn"] },
  { month: 10, tags: ["october", "halloween", "autumn"] },
  { month: 11, tags: ["november", "autumn"] },
  { month: 12, tags: ["december", "winter", "myBirthday"] },
]

interface filterTagsBaseProps {
  every?: boolean;
  tags: string[];
}

interface filterTagsProps extends filterTagsBaseProps {
  image: MediaImageItemType;
}

export function filterTags({ image, every = true, tags }: filterTagsProps) {
  return image.tags?.some((tag) =>
    every ? tags.every((mtag) => mtag === tag) : tags.some((mtag) => mtag === tag)
  )
}

interface filterImagesTagsProps extends filterTagsBaseProps {
  images: MediaImageItemType[];
}

export function filterImagesTags({ images, ...args }: filterImagesTagsProps) {
  return images.filter(
    (image) =>
      filterTags({ image, ...args })
  )
}

const monthlyFilter = filterMonthList.find((item) => item.month === currentMonth);

interface filterPickFixedProps {
  images: MediaImageItemType[];
  name: "topImage" | "pickup";
  monthly?: boolean;
}

export function filterPickFixed({ images, name: kind, monthly = true }: filterPickFixedProps) {
  return images.filter(
    (image) =>
      image[kind] ||
      (monthly && monthlyFilter && image[kind] !== false
        && filterTags({ image, tags: monthlyFilter.tags, every: false }))
  )
}

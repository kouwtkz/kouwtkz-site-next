import { ImageLoaderProps } from "next/image"

export default function microCMSLoader({ src, width }: ImageLoaderProps) {
  return `${src}?auto=format&fit=max&w=${width}`
}
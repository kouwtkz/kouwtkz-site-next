"use client"

import { ImageLoaderProps } from "next/image"

function microCMSLoader({ src, width }: ImageLoaderProps) {
  return `${src}?auto=format&fit=max&w=${width}`
}

export default function loaderSet(isStatic: boolean) {
  return isStatic ? microCMSLoader : undefined;
} 


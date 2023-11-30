"use client"

import { ImageLoaderProps } from "next/image"
// リサイズ済みのものを取得する形式にした
export default function loaderSet(isStatic: boolean, resizedUrl?: string) {
  // const resizedFunction = ({ src, width }: ImageLoaderProps) => `${src}?auto=format&fit=max&w=${width}`
  const resizedFunction = ({ src }: ImageLoaderProps) => resizedUrl ? resizedUrl : src;
  return isStatic ? resizedFunction : undefined;
} 


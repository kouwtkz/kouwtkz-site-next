"use client";

import { useSearchParams } from "next/navigation";
import { useSiteState } from "../context/site/SiteState";
import GalleryObject from "./GalleryObject";
import { ComicsViewer } from "./ComicsViewer";
import { useDataState } from "../context/start/DataState";

export function GalleryPage() {
  const s = useSearchParams();
  const galleryDefault = useSiteState().site?.gallery?.default;
  const { isComplete } = useDataState();
  if (!isComplete) return <></>;
  if (s.has("ebook")) return <ComicsViewer src={s.get("ebook") || ""} />;
  return <GalleryObject items={galleryDefault} />;
}

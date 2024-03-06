"use client";

import { useSearchParams } from "next/navigation";
import { useSiteState } from "../context/site/SiteState";
import GalleryObject from "./GalleryObject";
import { AlbumComicsViewer as AbComics, EPubViewer } from "./ComicsViewer";
import { useDataState } from "../context/start/DataState";

export function GalleryPage() {
  const s = useSearchParams();
  const galleryDefault = useSiteState().site?.gallery?.default;
  const { isComplete } = useDataState();
  if (!isComplete) return <></>;
  if (s.has("epub")) return <EPubViewer url={s.get("epub") || ""} />;
  if (s.has("comics")) return <AbComics name={s.get("comics") || ""} />;
  return <GalleryObject items={galleryDefault} />;
}

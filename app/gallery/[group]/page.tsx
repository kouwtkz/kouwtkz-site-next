import React from "react";
import { Metadata } from "next";
import GalleryObject from "../GalleryObject";
import { site } from "@/app/site/SiteData.mjs";

export async function generateStaticParams() {
  return (
    site.gallery?.generate?.map((_group) => ({
      group: typeof _group === "string" ? _group : _group.name,
    })) || []
  );
}

type Props = { params: { group: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: params.group.toUpperCase() };
}

export default async function Page({ params }: Props) {
  const { group } = params;
  const item =
    site.gallery?.generate?.find(
      (_group) => (typeof _group === "string" ? _group : _group.name) === group
    ) || group;
  return (
    <GalleryObject
      items={item}
      max={40}
      step={28}
      link={false}
      filterButton={true}
    />
  );
}

import React from "react";
import { Metadata } from "next";
import GalleryPage from "../GalleryPage";

export async function generateStaticParams() {
  return ["art", "fanart", "works", "given"].map((group) => {
    return { group };
  });
}

type Props = { params: { group: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: params.group.toUpperCase() };
}

export default async function Page({ params }: Props) {
  const { group } = params;
  return (
    <GalleryPage items={[group]} max={40} link={false} filterButton={true} />
  );
}

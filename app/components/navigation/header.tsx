import React from "react";
import Link from "next/link";
import { SiteDataType } from "@/app/context/site/SiteData.mjs";
import Breakcrumb from "./breadcrumb";
import { SiteMenu, SiteMenuButton } from "./SiteMenu";
import { SiteMenuItemType } from "@/app/context/site/SiteDataType";

type HeaderProps = {
  title: string;
};

export const SiteTitle = React.memo(function SiteTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="container my-3 inline-block">
      <Link href="/" className="inline-block px-2 h-10">
        <div
          id="siteTitle"
          className="text-2xl sm:text-3xl leading-10 font-MochiyPopOne text-main"
        >
          {title}
        </div>
      </Link>
    </div>
  );
});

export default function Header({ title }: HeaderProps) {
  return (
    <header className="fixed w-[100%] z-10 text-center">
      <SiteMenuButton />
      <Breakcrumb className="absolute left-0 m-1 h-14 w-14" />
      <SiteTitle title={title} />
      <SiteMenu />
      <div className="absolute top-0 m-0 h-[100%] w-[100%] bg-background-top opacity-90 -z-10" />
    </header>
  );
}

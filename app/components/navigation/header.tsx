"use client";

import React from "react";
import Link from "next/link";
import { SiteProps } from "@/app/site/SiteData.mjs";
import MenuButton from "@/app/svg/MenuButton";

type HeaderProps = {
  site: SiteProps;
};

export default function Header({ site }: HeaderProps) {
  return (
    <header className="fixed z-10 text-center w-[100vw]">
      <MenuButton className="block md:hidden absolute right-2 m-1" />
      <div className="container mt-4 mb-2 inline-block">
        <Link href="/" className="inline-block px-2 py-1">
          <div id="siteTitle" className="text-3xl font-MochiyPopOne text-main">
            {site.title}
          </div>
        </Link>
      </div>
      <div className="absolute top-0 m-0 h-[100%] w-[100%] bg-background-top opacity-90 -z-10"></div>
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { SiteProps } from "@/app/site/SiteData.mjs";
import MenuButton from "@/app/components/svg/MenuButton";
import Breakcrumb from "./breadcrumb";

type HeaderProps = {
  site: SiteProps;
};

export default function Header({ site }: HeaderProps) {
  return (
    <header className="fixed w-[100%] z-10 text-center">
      <Breakcrumb className="absolute left-0 m-1 h-14 w-14" />
      <MenuButton className="block absolute right-0 h-14 m-1 opacity-80" />
      <div className="container my-3 inline-block">
        <Link href="/" className="inline-block px-2 h-10">
          <div id="siteTitle" className="text-3xl font-MochiyPopOne text-main">
            {site.title}
          </div>
        </Link>
      </div>
      <div className="absolute top-0 m-0 h-[100%] w-[100%] bg-background-top opacity-90 -z-10"></div>
    </header>
  );
}

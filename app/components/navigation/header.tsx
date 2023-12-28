"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteProps, SiteMenuProps } from "@/app/site/SiteData.mjs";
import MenuButton from "@/app/components/svg/MenuButton";
import Breakcrumb from "./breadcrumb";

type HeaderProps = {
  site: SiteProps;
};

const SiteMenu = React.memo(function SiteMenu({
  nav,
  setIsOpen,
}: {
  nav: SiteMenuProps[];
  setIsOpen: Function;
}) {
  return (
    <div className="absolute right-0 bg-white bg-opacity-90 flex font-LuloClean flex-wrap justify-center md:flex-col sm:text-right">
      {nav.map((item, i) => (
        <Link
          key={i}
          href={item.url}
          className="min-w-48 px-4 py-2 hover:bg-main-pale-fluo"
          onClick={() => {
            setTimeout(() => {
              setIsOpen(false);
            }, 350);
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
});
const SiteTitle = React.memo(function SiteTitle({ title }: { title: string }) {
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

export default function Header({ site }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-[100%] z-10 text-center">
      <Breakcrumb className="absolute left-0 m-1 h-14 w-14" />
      <MenuButton
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="block absolute select-none right-0 h-14 m-1 opacity-80"
      />
      <SiteTitle title={site.title} />
      <div className="absolute top-0 m-0 h-[100%] w-[100%] bg-background-top opacity-90 -z-10" />
      {site.menu?.nav ? (
        <div className={isOpen ? "" : "hidden"}>
          <SiteMenu setIsOpen={setIsOpen} nav={site.menu.nav} />
        </div>
      ) : null}
    </header>
  );
}

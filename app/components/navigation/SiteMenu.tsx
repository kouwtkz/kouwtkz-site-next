"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteDataType, SiteMenuItemType } from "@/app/site/SiteData.mjs";
import MenuButton from "@/app/components/svg/button/MenuButton";
import { create } from "zustand";

type SiteMenuStateType = {
  isOpen: boolean;
  SetIsOpen: (isOpen: boolean) => void;
  ToggleIsOpen: () => void;
};
export const useSiteMenuState = create<SiteMenuStateType>((set) => ({
  isOpen: false,
  SetIsOpen: (isOpen) => {
    set(() => ({ isOpen }));
  },
  ToggleIsOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
}));

type SiteMenuProps = {
  nav?: SiteMenuItemType[];
};

const SetSiteMenu = React.memo(function SiteMenu({
  nav,
}: {
  nav: SiteMenuItemType[];
}) {
  const { SetIsOpen } = useSiteMenuState();
  return (
    <div className="absolute right-0 bg-white bg-opacity-90 flex font-LuloClean flex-wrap justify-center flex-col text-right">
      {nav.map((item, i) => (
        <Link
          key={i}
          href={item.url}
          className="min-w-48 px-4 py-2 hover:bg-main-pale-fluo"
          onClick={() => {
            setTimeout(() => {
              SetIsOpen(false);
            }, 350);
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
});

export function SiteMenu({ nav }: SiteMenuProps) {
  const { isOpen } = useSiteMenuState();
  return (
    <>
      {nav ? (
        <div className={isOpen ? "" : "hidden"}>
          <SetSiteMenu nav={nav} />
        </div>
      ) : null}
    </>
  );
}

export function SiteMenuButton() {
  const { isOpen, ToggleIsOpen } = useSiteMenuState();
  return (
    <MenuButton
      isOpen={isOpen}
      onClick={ToggleIsOpen}
      className="block absolute select-none right-0 h-14 m-1 opacity-80 fill-main"
    />
  );
}

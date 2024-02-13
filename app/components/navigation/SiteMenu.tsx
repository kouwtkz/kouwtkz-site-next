"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SiteDataType,
  SiteMenuItemType,
} from "@/app/context/site/SiteData.mjs";
import MenuButton from "@/app/components/svg/button/MenuButton";
import { create } from "zustand";
import { useSiteState } from "@/app/context/site/SiteState";
import { ThemeChangeButton } from "@/app/context/ThemeSetter";

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

const SetSiteMenu = React.memo(function SiteMenu({
  nav,
}: {
  nav: SiteMenuItemType[];
}) {
  const { SetIsOpen } = useSiteMenuState();
  return (
    <div className="absolute right-0 bg-white bg-opacity-90 flex font-LuloClean flex-wrap justify-center flex-col text-right select-none">
      {nav.map((item, i) => {
        const base = {
          className: "min-w-48 px-4 py-2 hover:bg-main-pale-fluo",
        };
        if (item.url)
          return (
            <Link
              key={i}
              href={item.url}
              {...base}
              onClick={() => {
                setTimeout(() => {
                  SetIsOpen(false);
                }, 350);
              }}
            >
              {item.name}
            </Link>
          );
        else {
          const className =
            "text-main-strong hover:text-main cursor-pointer " + base.className;
          switch (item.switch) {
            case "theme":
              return (
                <ThemeChangeButton key={i} className={className}>
                  {item.name}
                </ThemeChangeButton>
              );
          }
        }
      })}
    </div>
  );
});

export function SiteMenu() {
  const { isOpen } = useSiteMenuState();
  const { site } = useSiteState();
  return (
    <>
      {site?.menu?.nav ? (
        <div className={isOpen ? "" : "hidden"}>
          <SetSiteMenu nav={site.menu.nav} />
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

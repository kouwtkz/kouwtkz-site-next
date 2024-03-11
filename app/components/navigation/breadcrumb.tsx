"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, {
  HTMLAttributes,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { create } from "zustand";
import { BiLeftArrow } from "react-icons/bi";
import { UrlObject } from "url";

type BreakcrumbType = {
  backUrl: string | UrlObject;
  setBackUrl: (url: string | UrlObject) => void;
};
export const useBreakcrumb = create<BreakcrumbType>((set) => ({
  backUrl: "",
  setBackUrl(url) {
    set(() => {
      return { backUrl: url };
    });
  },
}));

export function queryCheck({
  query = {},
  separator,
}: {
  query?: { [k: string]: string | undefined };
  separator?: string;
}) {
  const queryValues = Object.values(query);
  const queryJoin = queryValues.join(separator);
  const queryEnable = queryValues.some((v) => v);
  return { queryValues, queryJoin, queryEnable };
}

function BreakcrumbInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { backUrl: backUrl_bc, setBackUrl: setBackUrl_bc } = useBreakcrumb();
  const entriesSearch = Array.from(search.entries());
  const joinSearch = entriesSearch.map(([k, v]) => `${k}=${v}`).join("&");
  const existsSearch = entriesSearch.length > 0;
  useEffect(
    () => () => {
      if (pathname || joinSearch) setBackUrl_bc("");
    },
    [pathname, joinSearch, setBackUrl_bc]
  );
  const backUrl: UrlObject = useMemo(() => {
    if (backUrl_bc)
      return typeof backUrl_bc === "string" ? { href: backUrl_bc } : backUrl_bc;
    else
      return {
        pathname: existsSearch ? pathname : pathname.replace(/[^/]+\/?$/, ""),
      };
  }, [backUrl_bc, existsSearch, pathname]);
  return (
    <>
      {pathname !== "/" ? (
        <div className="flex font-KosugiMaru select-none justify-center">
          <Link href={backUrl} className="p-3 text-main-soft">
            <BiLeftArrow className="h-8 w-8" />
          </Link>
        </div>
      ) : null}
    </>
  );
}

export default function Breakcrumb(args: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...args}>
      <Suspense>
        <BreakcrumbInner />
      </Suspense>
    </div>
  );
}

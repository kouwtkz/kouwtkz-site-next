"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { HTMLAttributes, Suspense } from "react";
import { create } from "zustand";
type BreakcrumbType = {};
import { BiLeftArrow } from "react-icons/bi";

export const useBreakcrumb = create<BreakcrumbType>((set) => ({}));

function BreakcrumbInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const existsSearch = Array.from(search.entries()).length > 0;
  const backUrl = existsSearch ? pathname : pathname.replace(/[^/]+\/?$/, "");
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

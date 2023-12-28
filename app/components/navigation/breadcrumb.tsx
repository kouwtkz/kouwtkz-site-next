"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { HTMLAttributes, Suspense } from "react";
import { create } from "zustand";
type BreakcrumbType = {};

export const useBreakcrumb = create<BreakcrumbType>((set) => ({}));

function BreakcrumbInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const existsSearch = Array.from(search.entries()).length > 0;
  const backUrl = existsSearch ? pathname : pathname.replace(/[^/]+\/?$/, "");
  return (
    <>
      {pathname !== "/" ? (
        <div className="flex font-KosugiMaru align-middle">
          <Link href={backUrl} className="p-3">
            <span className="inline-block h-8 w-8 text-2xl">◁</span>
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

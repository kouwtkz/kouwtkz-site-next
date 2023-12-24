"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { HTMLAttributes, Suspense } from "react";
import { create } from "zustand";
type BreakcrumbType = {};

export const useBreakcrumb = create<BreakcrumbType>((set) => ({}));

function BreakcrumbInner() {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" ? (
        <div className="flex">
          <Link href="./" className="m-1">
            ←戻る
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

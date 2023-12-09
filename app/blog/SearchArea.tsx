"use client";

import React, { Suspense, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useFixedRightBottom } from "@/app/components/navigation/fixed/RightBottom";

type SearchAreaProps = {
  flex?: boolean;
};

function Main({ flex = true }: SearchAreaProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  useHotkeys("slash", (e) => {
    searchRef.current?.focus();
    e.preventDefault();
  });
  useHotkeys(
    "escape",
    (e) => {
      if (document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        e.preventDefault();
      }
    },
    { enableOnFormTags: ["INPUT"] }
  );
  const search = useSearchParams();
  const q = search.get("q") || "";
  const { setChildren } = useFixedRightBottom();
  const searchArea = (
    <form
      className="my-5 mx-4"
      onSubmit={(e) => {
        if (searchRef.current) {
          router.push(`${location.pathname}?q=${searchRef.current.value}`);
          (document.activeElement as HTMLElement).blur();
          e.preventDefault();
        }
      }}
    >
      <input
        id="post_search"
        name="q"
        type="search"
        placeholder="検索"
        defaultValue={q}
        ref={searchRef}
        className="w-48 px-2"
      />
    </form>
  );
  useLayoutEffect(() => {
    if (flex)
      setChildren("searchArea", {
        row: 1,
        column: 0,
        children: searchArea,
      });
  });
  return flex ? null : searchArea;
}

export default function SearchArea({ flex }: SearchAreaProps) {
  return (
    <Suspense>
      <Main flex={flex} />
    </Suspense>
  );
}

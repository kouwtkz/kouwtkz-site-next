"use client";

import React, { Suspense, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { useFixedRightBottom } from "../components/navigation/fixed/RightBottom";

function Main() {
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
  useLayoutEffect(() => {
    setChildren("searchArea", {
      row: 1,
      column: 0,
      children: (
        <form
          className="fixed z-10 right-28 bottom-8"
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
      ),
    });
  });
  return null;
}

export default function SearchArea() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

"use client";

import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

type SearchAreaProps = {};

function Main({}: SearchAreaProps) {
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
  const qRef = useRef(q);
  useEffect(() => {
    if (qRef.current !== q) {
      if (searchRef.current) {
        const strq = String(q);
        if (searchRef.current.value !== strq)
          searchRef.current.value = strq;
      }
      if (qRef.current !== q) qRef.current = q;
    }
  });

  return (
    <form
      className="m-4"
      onSubmit={(e) => {
        if (searchRef.current) {
          const q = searchRef.current.value.replace("#", "%23");
          router.push(`${location.pathname}?q=${q}`);
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
        className="w-48 py-1 px-2"
      />
    </form>
  );
}

export default function SearchArea({}: SearchAreaProps) {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

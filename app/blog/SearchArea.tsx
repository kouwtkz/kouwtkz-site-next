"use client";

import React, {
  MutableRefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

function Main() {
  const el = useRef() as MutableRefObject<HTMLInputElement>;
  useHotkeys("slash", (e) => {
    el.current.focus();
    e.preventDefault();
  });
  useHotkeys(
    "escape",
    (e) => {
      if (document.activeElement === el.current) {
        el.current.blur();
        e.preventDefault();
      }
    },
    { enableOnFormTags: ["INPUT"] }
  );
  const search = useSearchParams();
  const q = search.get("q") || "";
  return (
    <form className="fixed z-10 right-28 bottom-8">
      <input
        id="post_search"
        name="q"
        type="search"
        placeholder="検索"
        defaultValue={q}
        ref={el}
        className="w-48 px-2"
      />
    </form>
  );
}

export default function SearchArea() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

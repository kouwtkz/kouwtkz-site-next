"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

const Main = () => {
  useHotkeys("slash", (e) => {
    (document.querySelector("input#post_search") as HTMLElement).focus();
    e.preventDefault();
  });
  useHotkeys(
    "escape",
    (e) => {
      (document.activeElement as HTMLElement).blur();
      e.preventDefault();
    },
    { enableOnFormTags: ["INPUT"] }
  );
  const search = useSearchParams();
  const q = search.get("q") || "";
  return (
    <form
    className="fixed z-10 right-28 bottom-8"
    >
      <input
        id="post_search"
        name="q"
        type="search"
        placeholder="検索"
        defaultValue={q}
        className="w-48 px-2"
      />
    </form>
  );
};

export default function SearchArea() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

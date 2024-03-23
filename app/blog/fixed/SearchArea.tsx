"use client";

import React, {
  HTMLAttributes,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { MakeURL } from "@/app/components/doc/MakeURL";

interface SearchAreaProps extends HTMLAttributes<HTMLFormElement> {}

export default function SearchArea({ className, ...args }: SearchAreaProps) {
  className = className ? ` ${className}` : "";
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
        if (searchRef.current.value !== strq) searchRef.current.value = strq;
      }
      if (qRef.current !== q) qRef.current = q;
    }
  });

  return (
    <form
      className={"m-4" + className}
      onSubmit={(e) => {
        if (searchRef.current) {
          const q = searchRef.current.value;
          const query = Object.fromEntries(search);
          if (q) query.q = q;
          else delete query.q;
          delete query.p;
          delete query.postId;
          router.push(MakeURL({ query }).href);
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

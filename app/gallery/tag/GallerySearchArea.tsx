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
import queryPush from "@/app/components/functions/queryPush";

interface SearchAreaProps extends HTMLAttributes<HTMLFormElement> {}

export default function GallerySearchArea({
  className,
  ...args
}: SearchAreaProps) {
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
      className={className}
      onSubmit={(e) => {
        if (searchRef.current) {
          const q = searchRef.current.value;
          queryPush({
            process: (params) => {
              if (q) params.q = q;
              else delete params.q;
              delete params.p;
            },
            push: router.push,
            search,
            scroll: false,
          });
          (document.activeElement as HTMLElement).blur();
          e.preventDefault();
        }
      }}
    >
      <input
        name="q"
        type="search"
        placeholder="検索"
        defaultValue={q}
        ref={searchRef}
        className="w-56 py-1 px-2"
      />
    </form>
  );
}

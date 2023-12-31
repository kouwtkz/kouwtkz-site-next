"use client";

import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

type PagingAreaProps = { max?: number };

function Main({ max }: PagingAreaProps) {
  const _min = 1;
  const _max = max || 1;
  const pagingInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const FormRef = useRef<HTMLFormElement>(null);
  useHotkeys(
    "escape",
    (e) => {
      if (document.activeElement === pagingInputRef.current) {
        pagingInputRef.current?.blur();
        e.preventDefault();
      }
    },
    { enableOnFormTags: ["INPUT"] }
  );
  const search = useSearchParams();
  const p = Number(search.get("p")) || 1;
  const pRef = useRef(p);
  useEffect(() => {
    if (pRef.current !== p) {
      if (pagingInputRef.current) {
        const strp = String(p);
        if (pagingInputRef.current.value !== strp)
          pagingInputRef.current.value = strp;
      }
      if (pRef.current !== p) pRef.current = p;
    }
  });
  const submit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (pagingInputRef.current) {
      const p = pagingInputRef.current;
      const url = new URL(location.href);
      const newSearch = Object.fromEntries(url.searchParams);
      const newP = Number(p.value);
      if (newP > 1) {
        newSearch["p"] = String(newP);
      } else {
        delete newSearch["p"];
      }
      if (newSearch.q) newSearch.q = newSearch.q.replace("#", "%23").replace("+", "%2B");
      router.push(
        `${url.pathname}?${Object.entries(newSearch)
          .map((v) => v.join("="))
          .join("&")}`
      );
      (document.activeElement as HTMLElement).blur();
      e?.preventDefault();
    }
  };

  return (
    <form ref={FormRef} className="flex flex-row" onSubmit={submit}>
      <button
        type="button"
        className={
          "mx-2 my-3 w-10 h-10 p-0 text-xl rounded-full bg-main-soft hover:bg-main-pale" +
          (_min >= p ? " opacity-40" : "")
        }
        disabled={_min >= p}
        onClick={() => {
          if (pagingInputRef.current) {
            if (_min < p) {
              pagingInputRef.current.value = String(p - 1);
              submit();
            }
          }
        }}
      >
        ＜
      </button>
      <input
        title="ブログページ"
        name="p"
        type="number"
        min={1}
        max={_max}
        defaultValue={p}
        ref={pagingInputRef}
        className="my-4 w-14 px-2"
      />
      <button
        type="button"
        className={
          "mx-2 my-3 w-10 h-10 text-xl rounded-full p-0 bg-main-soft hover:bg-main-pale" +
          (_max <= p ? " opacity-40" : "")
        }
        disabled={_max <= p}
        onClick={() => {
          if (pagingInputRef.current) {
            if (p < _max) {
              pagingInputRef.current.value = String(p + 1);
              submit();
            }
          }
        }}
      >
        ＞
      </button>
    </form>
  );
}

export default function PagingArea({ max }: PagingAreaProps) {
  return (
    <Suspense>
      <Main max={max} />
    </Suspense>
  );
}

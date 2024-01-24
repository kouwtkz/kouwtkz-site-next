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

interface PagingAreaProps extends HTMLAttributes<HTMLFormElement> {
  max?: number;
}

function Main({ max, className, ...args }: PagingAreaProps) {
  className = className ? ` ${className}` : "";
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
      const params = Object.fromEntries(search);
      const newP = Number(p.value);
      if (newP > 1) params.p = String(newP);
      else delete params.p;
      if (params.q) params.q = params.q.replace("#", "%23").replace("+", "%2B");
      else delete params.q;
      const query = new URLSearchParams(params).toString();
      const url = location.pathname + (query ? "?" + query : "");
      if (url !== location.href) router.push(url);
      (document.activeElement as HTMLElement).blur();
      e?.preventDefault();
    }
  };

  return (
    <form
      {...args}
      ref={FormRef}
      className={"flex flex-row" + className}
      onSubmit={submit}
    >
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

export default function PagingArea(args: PagingAreaProps) {
  return (
    <Suspense>
      <Main {...args} />
    </Suspense>
  );
}

"use client";

import React, { HTMLAttributes, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { MakeURL } from "@/app/components/functions/MakeURL";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface PagingAreaProps extends HTMLAttributes<HTMLFormElement> {
  max?: number;
}

export default function PagingArea({
  max,
  className,
  ...args
}: PagingAreaProps) {
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
      const newP = Number(p.value);
      const query = Object.fromEntries(search);
      if (newP > 1) query.p = String(newP);
      else delete query.p;
      router.push(MakeURL({ query }).href);
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
        title="前のページ"
        className={
          "mx-2 my-3 w-10 h-10 p-0 rounded-full bg-main-soft hover:bg-main-pale" +
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
        <AiFillCaretLeft className="fill-white w-8 h-8 my-1 mx-[0.15rem]" />
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
        title="次のページ"
        className={
          "mx-2 my-3 w-10 h-10 rounded-full p-0 bg-main-soft hover:bg-main-pale" +
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
        <AiFillCaretRight className="fill-white w-8 h-8 my-1 mx-[0.35rem]" />
      </button>
    </form>
  );
}

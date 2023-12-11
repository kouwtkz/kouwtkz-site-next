"use client";

import React, { Suspense } from "react";
import PagingArea from "./PagingArea";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";

type props = { isStatic: boolean; max?: number };

export default function Fixed({ isStatic, max }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-row m-2">
        <div className="flex flex-col-reverse">
          <PagingArea max={max} />
        </div>
        {!isStatic ? (
          <div className="flex flex-col-reverse">
            <SearchArea />
          </div>
        ) : null}
        <div className="flex flex-col">{!isStatic ? <PostButton /> : null}</div>
      </div>
    </div>
  );
}

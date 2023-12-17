"use client";

import React, { Suspense } from "react";
import PagingArea from "./PagingArea";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";

type props = { isStatic: boolean; max?: number };

export default function Fixed({ isStatic, max }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-wrap justify-end m-2 ml-36">
        <PagingArea max={max} />
        <div className="flex flex-row">
          <SearchArea />
          {process.env.NODE_ENV === "development" ? <PostButton /> : <></>}
        </div>
      </div>
    </div>
  );
}

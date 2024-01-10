"use client";

import React from "react";
import PagingArea from "./PagingArea";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";

type props = { isStatic: boolean; max?: number };

export default function Fixed({ isStatic, max }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0 pointer-events-none">
      <div className="flex flex-wrap justify-end m-2 ml-36">
        <PagingArea max={max} className="pointer-events-auto" />
        <div className="flex flex-row [&>*]:pointer-events-auto">
          <SearchArea />
          {!isStatic || process.env.NODE_ENV !== "production" ? (
            <PostButton />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

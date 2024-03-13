"use client";

import React, { Suspense } from "react";
import PagingArea from "./PagingArea";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";
import { useServerState } from "@/app/context/system/ServerState";
import HandsClapButton from "./HandsClapButton";

type props = { max?: number };

export default function Fixed({ max }: props) {
  const { isServerMode } = useServerState();

  return (
    <Suspense>
      <div className="fixed z-30 right right-0 bottom-0 pointer-events-none">
        <div className="flex flex-wrap justify-end m-2 ml-36">
          <PagingArea max={max} className="pointer-events-auto" />
          <div className="flex flex-row [&>*]:pointer-events-auto">
            <SearchArea />
            {isServerMode ? <PostButton /> : <HandsClapButton />}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

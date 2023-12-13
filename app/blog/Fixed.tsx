"use client";

import React, { Suspense } from "react";
import PagingArea from "./PagingArea";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";
import { useCurrentUser } from "../context/user/CurrentUser";

type props = { isStatic: boolean; max?: number; };

export default function Fixed({ isStatic, max }: props) {
  const { user: currentUser } = useCurrentUser();
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-wrap justify-end m-2 ml-36">
        <PagingArea max={max} />
        {!isStatic ? (
          <div className="flex flex-row">
            <SearchArea />
            {currentUser ? <PostButton /> : <></>}
          </div>
        ) : null}
      </div>
    </div>
  );
}

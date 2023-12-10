"use client";

import React, { Suspense } from "react";
import SearchArea from "./SearchArea";
import PostButton from "./PostButton";
import LikeButton from "@/app/components/button/LikeButton";

type props = { isStatic: boolean };

function Main({ isStatic }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-row m-2">
        <div className="flex flex-col-reverse">
          {!isStatic ? <SearchArea /> : null}
        </div>
        <div className="flex flex-col">
          {!isStatic ? <PostButton /> : null}
        </div>
      </div>
    </div>
  );
}

export default function Fixed({ isStatic }: props) {
  return (
    <Suspense>
      <Main isStatic={isStatic} />
    </Suspense>
  );
}

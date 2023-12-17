"use client";

import React, { Suspense } from "react";
import PostButton from "./PostButton";

type props = { isStatic: boolean; postId: string; };

export default function Main({ isStatic, postId }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-row m-2">
        <div className="flex flex-col">
          {isStatic ? <></> : <PostButton /> }
        </div>
      </div>
    </div>
  );
}

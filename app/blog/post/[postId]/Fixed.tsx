"use client";

import React, { Suspense } from "react";
import PostButton from "../../PostButton";
import LikeButton from "@/app/components/button/LikeButton";

type props = { isStatic: boolean; postId: string };

function Main({ isStatic, postId }: props) {
  return (
    <div className="fixed z-30 right-2 bottom-2">
      <div className="flex flex-row">
        <div className="flex flex-col">
          {!isStatic ? <LikeButton /> : null}
          {!isStatic ? <PostButton postId={postId} /> : null}
        </div>
      </div>
    </div>
  );
  return <></>;
}

export default function Fixed({ isStatic, postId }: props) {
  return (
    <Suspense>
      <Main isStatic={isStatic} postId={postId} />
    </Suspense>
  );
}

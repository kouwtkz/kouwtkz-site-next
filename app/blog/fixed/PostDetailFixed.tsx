"use client";

import React, { Suspense } from "react";
import PostButton from "./PostButton";
import { useServerState } from "@/app/components/System/ServerState";

type props = { postId: string };

export default function Main({ postId }: props) {
  const { isServerMode } = useServerState();
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-row m-2">
        <div className="flex flex-col">
          {isServerMode ? <PostButton postId={postId} /> : <></>}
        </div>
      </div>
    </div>
  );
}

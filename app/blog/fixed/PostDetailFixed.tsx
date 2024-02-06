"use client";

import React, { Suspense } from "react";
import PostButton from "./PostButton";
import { useServerState } from "@/app/components/System/ServerState";
import SearchArea from "./SearchArea";

type props = { postId: string };

export default function Main({ postId }: props) {
  const { isServerMode } = useServerState();
  return (
    <div className="fixed z-30 right right-0 bottom-0 pointer-events-none">
      <div className="flex flex-wrap justify-end m-2 ml-36">
        <div className="flex flex-row [&>*]:pointer-events-auto">
          <SearchArea />
          {isServerMode ? <PostButton postId={postId} /> : <></>}
        </div>
      </div>
    </div>
  );
}

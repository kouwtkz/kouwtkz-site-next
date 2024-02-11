"use client";

import React, { Suspense } from "react";
import PostButton from "./PostButton";
import { useServerState } from "@/app/components/System/ServerState";
import SearchArea from "./SearchArea";
import { Post } from "../Post";
import BackForwardPost from "./BackForwardPost";
import HandsClapButton from "./HandsClapButton";

type props = { postId: string; posts: Post[] };

export default function Main(args: props) {
  const { isServerMode } = useServerState();
  return (
    <Suspense>
      <div className="fixed z-30 right right-0 bottom-0 pointer-events-none">
        <div className="flex flex-wrap justify-end m-2 ml-36">
          <div className="flex flex-row [&>*]:pointer-events-auto">
            <BackForwardPost {...args} />
            <SearchArea />
            {isServerMode ? (
              <PostButton postId={args.postId} />
            ) : (
              <HandsClapButton />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

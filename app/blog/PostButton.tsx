"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { usePostTargetState } from "./PostTargetState";
import { useHotkeys } from "react-hotkeys-hook";

const PostButton = () => {
  const router = useRouter();
  const { postTarget } = usePostTargetState();
  const link = `/blog/post${postTarget ? `?target=${postTarget.postId}` : ""}`;
  useHotkeys("n", () => router.push(link));
  return (
    <button
      className="fixed right-0 bottom-0 m-8 w-12 h-12 text-xl rounded-full p-0"
      onClick={() => router.push(link)}
    >
      {postTarget ? "📝" : "🖊"}
    </button>
  );
};

export default PostButton;

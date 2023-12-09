"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useFixedRightBottom } from "../components/navigation/fixed/RightBottom";

export default function PostButton({ postId }: { postId?: string }) {
  const router = useRouter();
  const { setChildren } = useFixedRightBottom();
  const link = `/blog/post${postId ? `?target=${postId}` : ""}`;
  useHotkeys("n", () => router.push(link));
  useEffect(() => {
    setChildren("PostButton", {
      row: 0,
      column: 0,
      children: (
        <button
          className="m-4 w-16 h-16 text-2xl rounded-full p-0"
          onClick={() => router.push(link)}
        >
          {postId ? "📝" : "🖊"}
        </button>
      ),
    });
  });
  return <></>;
}

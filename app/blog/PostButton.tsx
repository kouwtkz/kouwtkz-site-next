"use client";

import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useFixedRightBottom } from "@/app/components/navigation/fixed/RightBottom";

export default function PostButton({
  postId,
  flex = true,
}: {
  postId?: string;
  flex?: boolean;
}) {
  const router = useRouter();
  const { setChildren } = useFixedRightBottom();
  const link = `/blog/post${postId ? `?target=${postId}` : ""}`;
  const postButton = (
    <button
      className="m-2 w-12 h-12 text-2xl rounded-full p-0"
      onClick={() => router.push(link)}
    >
      {postId ? "📝" : "🖊"}
    </button>
  );
  useHotkeys("n", () => router.push(link));
  useLayoutEffect(() => {
    if (flex)
      setChildren("PostButton", {
        row: 0,
        column: 0,
        children: postButton,
      });
  });
  return flex ? null : postButton;
}

"use client";

import { useFixedRightBottom } from "@/app/components/navigation/fixed/RightBottom";
import { useLayoutEffect } from "react";

export default function LikeButton({ flex = true }: { flex?: boolean }) {
  const { setChildren } = useFixedRightBottom();
  const likeButton = (
    <button
      className="m-2 w-12 h-12 text-2xl rounded-full p-0"
      onClick={() => {}}
    >
      ♡
    </button>
  );
  useLayoutEffect(() => {
    if (flex)
      setChildren("LikeButton", {
        row: 0,
        column: 0,
        children: likeButton,
      });
  });
  return flex ? null : likeButton;
}

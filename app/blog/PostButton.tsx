"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function PostButton({ postId }: { postId?: string }) {
  const router = useRouter();
  const link = `/blog/post${postId ? `?target=${postId}` : ""}`;
  useHotkeys("n", () => router.push(link));
  return (
    <button
      className="m-2 w-12 h-12 text-2xl rounded-full p-0"
      onClick={() => router.push(link)}
    >
      {postId ? "📝" : "🖊"}
    </button>
  );
}

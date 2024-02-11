"use client";

import { useRouter } from "next/navigation";
import React, { HTMLAttributes } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AiFillEdit } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";

interface PostButtonProps extends HTMLAttributes<HTMLButtonElement> {
  postId?: string;
}

export default function PostButton({
  postId,
  className,
  ...args
}: PostButtonProps) {
  className = className ? ` ${className}` : "";
  const router = useRouter();
  const link = `/blog/post${postId ? `?target=${postId}` : ""}`;
  useHotkeys("n", () => router.push(link));
  return (
    <button
      {...args}
      className={"m-2 w-12 h-12 text-2xl rounded-full p-0" + className}
      onClick={() => router.push(link)}
    >
      {postId ? <TfiWrite className="w-6 h-6 m-[0.65rem]" /> : <AiFillEdit className="w-7 h-7 m-[0.55rem]" />}
    </button>
  );
}

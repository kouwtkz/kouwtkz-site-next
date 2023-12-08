"use client"

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckPostId() {
  const router = useRouter();
  const search = useSearchParams();
  const postId = search.get("postId");
  useEffect(() => {
    if (postId) {
      router.replace(`/blog/post/${postId}`)
      router.refresh()
    }
  })
  return null;
} 

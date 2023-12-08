"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function Main() {
  const router = useRouter();
  const search = useSearchParams();
  const postId = search.get("postId");
  useEffect(() => {
    if (postId) {
      router.replace(`/blog/post/${postId}`);
      router.refresh();
    }
  });
  return null;
}
export default function CheckPostId() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

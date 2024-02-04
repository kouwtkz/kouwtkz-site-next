"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

// データが存在しないときの画面
export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  if (/^\/character\/.+/.test(pathname))
    router.replace(`/character?name=${pathname.split("/")[2]}`);
  return (
    <div className="pt-24">
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main text-center my-12  mb-3">
        404 not found
      </h1>
      <h4 className="text-main-soft text-center text-xl font-bold">
        ページが見つかりませんでした
      </h4>
    </div>
  );
}

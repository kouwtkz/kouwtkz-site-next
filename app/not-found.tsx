"use client";
import React from "react";

// データが存在しないときの画面
export default function NotFound() {
  return (
    <div className="pt-24">
      <h1 className="text-main text-center text-4xl my-12 font-LuloClean mb-3">
        404 not found
      </h1>
      <h4 className="text-main-soft text-center text-xl font-bold">
        ページが見つかりませんでした
      </h4>
    </div>
  );
}

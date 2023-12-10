"use client";

import React, { Suspense } from "react";
import LikeButton from "@/app/components/button/LikeButton";

type props = { isStatic: boolean };

export default function Main({ isStatic }: props) {
  return (
    <div className="fixed z-30 right right-0 bottom-0">
      <div className="flex flex-row m-2">
        <div className="flex flex-col">{!isStatic ? <LikeButton /> : null}</div>
      </div>
    </div>
  );
}

"use client";

import React, { Suspense } from "react";
import LikeButton from "@/app/components/button/LikeButton";

type props = { isStatic: boolean };

function Main({ isStatic }: props) {
  return (
    <div className="fixed z-30 right-2 bottom-2">
      <div className="flex flex-row">
        <div className="flex flex-col">{!isStatic ? <LikeButton /> : null}</div>
      </div>
    </div>
  );
}

export default function Fixed({ isStatic }: props) {
  return (
    <Suspense>
      <Main isStatic={isStatic} />
    </Suspense>
  );
}

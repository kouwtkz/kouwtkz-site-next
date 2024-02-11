"use client";

import { useSiteState } from "@/app/context/site/SiteState";
import Link from "next/link";
import React, { HTMLAttributes } from "react";
import { PiHandsClapping } from "react-icons/pi";

interface PostButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  postId?: string;
}

export default function HandsClapButton({
  postId,
  className,
  ...args
}: PostButtonProps) {
  className = className ? ` ${className}` : "";
  const { site } = useSiteState();
  return site?.wavebox ? (
    <Link
      {...args}
      href={site.wavebox}
      title="拍手ボタン"
      className={"button m-2 w-12 h-12 text-2xl rounded-full p-0" + className}
      target="_blank"
      prefetch={false}
    >
      <PiHandsClapping className="w-8 h-8 my-2 mx-[0.45rem]" />
    </Link>
  ) : (
    <></>
  );
}

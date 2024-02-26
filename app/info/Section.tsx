"use client"

import { ReactNode } from "react";
import { MdClientNode } from "../context/md/MarkdownDataClient";

export function MdSection({
  title,
  mdSrc,
  children,
}: {
  title: string;
  mdSrc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="my-4 flex flex-col items-center">
      <h4 className="mb-2">{title}</h4>
      {mdSrc ? (
        <div className="mx-2 [&_ul]:text-left flex flex-col max-w-2xl">
          <MdClientNode className="info" name={mdSrc} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
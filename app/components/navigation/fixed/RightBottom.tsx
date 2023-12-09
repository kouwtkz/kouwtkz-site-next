"use client";

import { useLayoutEffect, useRef } from "react";
import { GetArrayChildren, createFixedState } from "./State";
import { usePathname } from "next/navigation";
export const useFixedRightBottom = createFixedState();

export default function FixedRightBottom() {
  const { childrenMap, clearChildren } = useFixedRightBottom();
  const pathname = usePathname();
  const stockPathnameRef = useRef("");
  useLayoutEffect(() => {
    if (stockPathnameRef.current !== pathname) {
      clearChildren();
      stockPathnameRef.current = pathname;
    }
  });
  const arrayChilren = GetArrayChildren(childrenMap);
  return (
    <>
      {arrayChilren.length > 0 ? (
        <div className="fixed right z-30 bottom-2 right-2 flex flex-row-reverse">
          {arrayChilren.map((rows, rowi) => (
            <div className="flex flex-col-reverse" key={rowi}>
              {rows.map((columns) =>
                columns.map((children) => (
                  <div key={children.key}>{children.children}</div>
                ))
              )}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

"use client";

import { RefObject, useEffect, useState } from "react";
import useScroll from "../hook/useScroll";
import TriangleCursor from "../svg/cursor/Triangle";

type InPageRefObject = {
  name: string;
  ref: RefObject<HTMLElement>;
};

export default function InPageMenu({
  list = [],
  adjust = 16,
}: {
  list?: InPageRefObject[];
  adjust?: number;
}) {
  const [refPrompt, setRefPrompt] = useState(false);
  useEffect(() => {
    if (refPrompt) {
      setRefPrompt(false);
    }
  }, [refPrompt]);
  const [x, y] = useScroll();
  const jy = y + adjust;
  const firstTop = list.length > 0 ? list[0].ref.current?.offsetTop || 0 : 0;
  return (
    <div className="fixed z-10 right-0 bottom-0 mb-2 pr-1 font-LuloClean">
      {list.map((item, i) => {
        if (!refPrompt && !item.ref.current) setRefPrompt(true);
        const elm = list[i].ref.current;
        if ((elm?.children.length || 0) === 0) return null;
        const top = (elm?.offsetTop || 0) - firstTop;
        const bottom = top + (elm?.offsetHeight || 0);
        const currentMode = top <= jy && jy < bottom;
        return (
          <div
            key={i}
            className={
              "flex flex-row items-baseline px-1 py-1 w-32 md:w-44 text-left text-sm sm:text-xl font-black cursor-pointer " +
              (currentMode
                ? "text-main-strong hover:text-main-deep"
                : "text-main-soft hover:text-main")
            }
            onClick={() => {
              const top = (elm?.offsetTop || 0) - firstTop;
              scrollTo({ top, behavior: "smooth" });
            }}
          >
            <div className="w-3 h-3 md:w-4 md:h-4 mr-1">
              {currentMode ? (
                <TriangleCursor className="mx-auto fill-main h-full" />
              ) : null}
            </div>
            <div className="flex-1">{item.name}</div>
          </div>
        );
      })}
      <div className="bg-background-top opacity-70 xl:hidden absolute top-0 -z-10 w-[100%] h-[100%]" />
    </div>
  );
}

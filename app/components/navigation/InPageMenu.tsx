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
  firstTopRef,
  adjust = 16,
}: {
  list?: InPageRefObject[];
  firstTopRef?: RefObject<HTMLElement>;
  adjust?: number;
}) {
  const [refPrompt, setRefPrompt] = useState(false);
  useEffect(() => {
    if (refPrompt && list.some(({ ref }) => ref.current)) {
      setRefPrompt(false);
    }
  }, [refPrompt, list]);
  const [x, y] = useScroll();
  const jy = y + adjust;
  const firstTop =
    list.length > 0 ? (firstTopRef || list[0].ref)?.current?.offsetTop || 0 : 0;
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
              "flex flex-row items-baseline px-1 py-1 min-w-[8rem] md:min-w-[11rem] text-left text-sm sm:text-xl font-black cursor-pointer " +
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
            <div className="flex-1">
              <span className="mr-2">{item.name}</span>
            </div>
          </div>
        );
      })}
      <div className="bg-background-top opacity-70 2xl:hidden absolute top-0 -z-10 w-[100%] h-[100%]" />
    </div>
  );
}

"use client";

import { RefObject, useEffect, useState } from "react";
import useScroll from "../hook/useScroll";

type InPageRefObject = {
  name: string;
  ref: RefObject<HTMLElement>;
};

export default function InPageMenu({
  list = [],
}: {
  list?: InPageRefObject[];
}) {
  const [refPrompt, setRefPrompt] = useState(false);
  useEffect(() => {
    if (refPrompt) {
      setRefPrompt(false);
    }
  }, [refPrompt]);
  const [x, y] = useScroll();
  const jy = y + 64;
  const firstTop = list.length > 0 ? list[0].ref.current?.offsetTop || 0 : 0;
  return (
    <div className="fixed z-10 right-0 bottom-0 mb-2 pr-1 font-LuloClean">
      {list.map((item, i) => {
        if (!refPrompt && !item.ref.current) setRefPrompt(true);
        const elm = list[i].ref.current;
        const top = (elm?.offsetTop || 0) - firstTop;
        const bottom = top + (elm?.offsetHeight || 0);
        const currentMode = top <= jy && jy < bottom;
        return (
          <div
            key={i}
            className={
              "px-2 py-1 text-left text-base sm:text-xl font-black cursor-pointer " +
              (currentMode
                ? "text-main-dark hover:text-main-grayish"
                : "text-main-strong hover:text-main-deep")
            }
            onClick={() => {
              scrollTo({ top, behavior: "smooth" });
            }}
          >
            {item.name}
          </div>
        );
      })}
      <div className="bg-background-top opacity-70 xl:hidden absolute top-0 -z-10 w-[100%] h-[100%]" />
    </div>
  );
}

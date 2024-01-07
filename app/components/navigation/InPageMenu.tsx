"use client";

import { RefObject } from "react";
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
  const [x, y] = useScroll();
  const jy = y + 64;
  const firstTop = list.length > 0 ? list[0].ref.current?.offsetTop || 0 : 0;
  return (
    <div className="fixed z-10 right-0 bottom-0 mb-2 pr-2">
      {list.map((item, i) => {
        const elm = list[i].ref.current;
        const top = (elm?.offsetTop || 0) - firstTop;
        const bottom = top + (elm?.offsetHeight || 0);
        const currentMode = top <= jy && jy < bottom;
        return (
          <div
            key={i}
            className={
              "bg-white bg-opacity-70 font-LuloClean px-2 py-1 text-left text-base sm:text-xl font-black cursor-pointer " +
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
    </div>
  );
}

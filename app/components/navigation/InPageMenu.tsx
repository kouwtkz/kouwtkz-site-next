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
  const firstTop = list.length > 0 ? list[0].ref.current?.offsetTop || 0 : 0;
  return (
    <div className="fixed z-10 right-0 bottom-0 mb-4 pr-4">
      {list.map((item, i) => {
        const elm = list[i].ref.current;
        const top = (elm?.offsetTop || 0) - firstTop;
        const bottom = top + (elm?.offsetHeight || 0);
        const currentMode = top <= y && y < bottom;
        return (
          <div
            key={i}
            className={
              "font-LuloClean m-1 text-left text-base sm:text-lg cursor-pointer " +
              (currentMode ? "text-main-deep hover:text-dark" : "text-main-soft hover:text-main")
            }
            style={{
              textShadow: "white 0 2px 1px",
            }}
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

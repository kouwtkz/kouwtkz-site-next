"use client";

import { HTMLAttributes } from "react";
import { useCookies } from "react-cookie";

interface BackForwardPostProps extends HTMLAttributes<HTMLDivElement> {}

export default function ThemeSetter({
  children = "いろかえ",
  ...args
}: BackForwardPostProps) {
  const [cookies, setCookie, removeCookie] = useCookies(["theme"]);
  return (
    <div
      {...args}
      onClick={() => {
        const className = "theme-orange";
        const themeContain =
          document.documentElement.classList.contains(className);
        if (themeContain) {
          removeCookie("theme");
          document.documentElement.classList.remove(className);
        } else {
          setCookie("theme", className);
          document.documentElement.classList.add(className);
        }
      }}
    >
      {children}
    </div>
  );
}

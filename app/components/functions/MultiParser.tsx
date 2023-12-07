"use client";

import React, { useEffect, useState } from "react";
import Twemoji from "react-twemoji";
import HtmlParse from "html-react-parser";
import { parse } from "marked";
import { useRouter } from "next/navigation";
type MultiParserProps = {
  markdown?: boolean;
  toDom?: boolean;
  twemoji?: boolean;
  all?: boolean;
  className?: string;
  children?: React.ReactNode | string;
};
const MultiParser = ({
  markdown,
  toDom,
  twemoji,
  all,
  className,
  children,
}: MultiParserProps) => {
  const router = useRouter();
  useEffect(() => {
    if (window) {
      const aCheckList = document.querySelectorAll("[data-a-check]");
      aCheckList.forEach((elm) => {
        const checkMode = elm.getAttribute("data-a-check");
        elm.removeAttribute("data-a-check");
        if (checkMode === "1") {
          elm.querySelectorAll("a").forEach((a) => {
            if (!a.target) {
              a.addEventListener("click", (e) => {
                const ta = e.target as HTMLAnchorElement;
                router.push(ta.href);
                e.stopPropagation();
                e.preventDefault();
              });
            }
          });
        }
      });
    }
  });
  let checkMode = "0";
  if (typeof children === "string") {
    if (all) {
      markdown = true;
      toDom = true;
      twemoji = true;
    }
    let childString = children;
    if (markdown) childString = parse(childString);
    if (toDom) {
      checkMode = "1";
      children = HtmlParse(childString);
    } else children = childString;
  }
  if (twemoji)
    children = <Twemoji options={{ className: "emoji" }}>{children}</Twemoji>;
  children = (
    <div className={className} data-a-check={checkMode}>
      {children}
    </div>
  );
  return <>{children}</>;
};

export default MultiParser;

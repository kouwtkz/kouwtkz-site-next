"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
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
  linkPush?: boolean;
  children?: React.ReactNode | string;
};
const MultiParser = ({
  markdown,
  toDom,
  twemoji,
  all,
  linkPush,
  className,
  children,
}: MultiParserProps) => {
  const router = useRouter();
  const divRef = useRef() as MutableRefObject<HTMLDivElement>;
  if (all) {
    markdown = true;
    toDom = true;
    twemoji = true;
    linkPush = true;
  }
  useEffect(() => {
    if (linkPush && window) {
      const aList = divRef.current.querySelectorAll(
        "a:not([data-a-push])"
      ) as NodeListOf<HTMLAnchorElement>;
      aList.forEach((a) => {
        const url = new URL(a.href);
        if (url.origin === location.origin && !a.target) {
          a.dataset.aPush = "";
          a.addEventListener("click", (e) => {
            router.push(url.href.replace(/\/+$/, ""));
            e.preventDefault();
          });
        }
      });
    }
  });
  if (typeof children === "string") {
    let childString = children;
    if (markdown) childString = parse(childString);
    if (toDom) {
      children = HtmlParse(childString);
    } else children = childString;
  }
  if (twemoji)
    children = <Twemoji options={{ className: "emoji" }}>{children}</Twemoji>;
  className = (className ? `${className} ` : "") + "parsed";
  children = (
    <div className={className} ref={divRef}>
      {children}
    </div>
  );
  return <>{children}</>;
};

export default MultiParser;

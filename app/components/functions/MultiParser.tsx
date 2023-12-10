"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Twemoji from "react-twemoji";
import HtmlParse from "html-react-parser";
import { parse } from "marked";
import { useRouter } from "next/navigation";
type MultiParserOptions = {
  markdown?: boolean;
  toDom?: boolean;
  twemoji?: boolean;
  linkPush?: boolean;
  hashtag?: boolean;
};
type MultiParserProps = MultiParserOptions & {
  only?: MultiParserOptions;
  className?: string;
  children?: React.ReactNode | string;
};
const MultiParser = ({
  markdown = true,
  toDom = true,
  twemoji = true,
  linkPush = true,
  hashtag = true,
  only,
  className,
  children,
}: MultiParserProps) => {
  const router = useRouter();
  const divRef = useRef() as MutableRefObject<HTMLDivElement>;
  if (only) {
    markdown = only.markdown === undefined ? false : only.markdown;
    toDom = only.toDom === undefined ? false : only.toDom;
    twemoji = only.twemoji === undefined ? false : only.twemoji;
    linkPush = only.linkPush === undefined ? false : only.linkPush;
    hashtag = only.hashtag === undefined ? false : only.hashtag;
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
    if (hashtag) {
      childString = childString.replace(
        /(^|<[^>]+>)([^<]+)(<|$)/g,
        (m, start, main, end) => {
          if (/^\s+$/.test(main) || /^<\s*(code)[\s>]/.test(start)) return m;
          else {
            main = main
              .replace(/#([^#\s]+)\s?/g, `<a href="/blog?q=%23$1">#$1</a>`)
              .replace(/(<\/a>)(<a)/g, "$1 $2");
            return `${start}${main}${end}`;
          }
        }
      );
    }
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

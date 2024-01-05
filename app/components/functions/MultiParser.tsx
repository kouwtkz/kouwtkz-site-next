"use client";

import React, { MutableRefObject, useLayoutEffect, useRef } from "react";
import HTMLReactParser from "html-react-parser";
import { parse } from "marked";
import { useRouter } from "next/navigation";
import twemoji from "twemoji";
import Twemoji from "react-twemoji";

type MultiParserOptions = {
  markdown?: boolean;
  toDom?: boolean;
  toTwemoji?: boolean;
  detailsClosable?: boolean;
  linkPush?: boolean;
  hashtag?: boolean;
};
type MultiParserProps = MultiParserOptions & {
  only?: MultiParserOptions;
  className?: string;
  detailsOpen?: boolean;
  twemojiTag?: string;
  tag?: string;
  children?: React.ReactNode | string;
};

function MultiParser({
  markdown = true,
  toDom = true,
  toTwemoji = true,
  linkPush = true,
  hashtag = true,
  detailsOpen = false,
  detailsClosable = true,
  only,
  className,
  twemojiTag,
  tag = "div",
  children,
}: MultiParserProps) {
  const router = useRouter();
  const parsedRef = useRef() as MutableRefObject<HTMLDivElement>;
  if (only) {
    markdown = only.markdown === undefined ? false : only.markdown;
    toTwemoji = only.toTwemoji === undefined ? false : only.toTwemoji;
    toDom = only.toDom === undefined ? toTwemoji : only.toDom;
    linkPush = only.linkPush === undefined ? false : only.linkPush;
    hashtag = only.hashtag === undefined ? false : only.hashtag;
    detailsClosable =
      only.detailsClosable === undefined ? false : only.detailsClosable;
  }
  useLayoutEffect(() => {
    if (window) {
      if (linkPush) {
        const aList = parsedRef.current.querySelectorAll(
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
      if (detailsOpen) {
        parsedRef.current
          .querySelectorAll("details:not([manual]):not([open])")
          .forEach((details) => details.setAttribute("open", ""));
      }
      if (detailsClosable) {
        parsedRef.current
          .querySelectorAll("details:not([added-close])")
          .forEach((details) => {
            const closeButton = document.createElement("button");
            closeButton.classList.add("close");
            closeButton.innerText = "たたむ";
            closeButton.title = "折りたたむ";
            closeButton.onclick = () => details.removeAttribute("open");
            details.appendChild(closeButton);
            details.setAttribute("added-close", "");
          });
      }
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
    if (toTwemoji) childString = twemoji.parse(childString);
    if (toDom) {
      children = HTMLReactParser(childString);
    } else children = childString;
  } else {
    children = (
      <Twemoji tag={twemojiTag} options={{ className: "emoji" }}>
        {children}
      </Twemoji>
    );
  }
  className = (className ? `${className} ` : "") + "parsed";
  return React.createElement(tag, { className, ref: parsedRef }, children);
}

export default MultiParser;

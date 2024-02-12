"use client";

import React, { MutableRefObject, useLayoutEffect, useRef } from "react";
import HTMLReactParser from "html-react-parser";
import { parse } from "marked";
import { useRouter } from "next/navigation";
import twemoji from "twemoji";
import Twemoji from "react-twemoji";
import { MakeURL } from "../functions/MakeURL";
import { useMediaImageState } from "@/app/context/image/MediaImageState";

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
  parsedClassName?: string;
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
  parsedClassName = "parsed",
  children,
}: MultiParserProps) {
  const router = useRouter();
  const parsedRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { imageItemList, isSet: imagesIsSet } = useMediaImageState();
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
        /(^|<[^>]+>)([^<]+)(<\/[^>]+>|$)/g,
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
      children = HTMLReactParser(childString, {
        replace: (v) => {
          if ("attribs" in v) {
            if (v.name === "a") {
              const url = v.attribs.href;
              if (/^.+:\/\//.test(url)) {
                v.attribs.target = "_blank";
                v.attribs.class =
                  (v.attribs.class ? `${v.attribs.class} ` : "") + "external";
              } else {
                v.attribs.onClick = ((e: any) => {
                  if (url.startsWith("?")) {
                    const toSearch = Object.fromEntries(
                      new URLSearchParams(url)
                    );
                    const scroll = toSearch.scroll === "true";
                    if (toSearch.scroll) delete toSearch.scroll;
                    router.push(
                      MakeURL({
                        query: {
                          ...Object.fromEntries(
                            new URLSearchParams(location.search)
                          ),
                          ...toSearch,
                        },
                      }).href,
                      { scroll }
                    );
                  } else {
                    router.push(MakeURL(url).href);
                  }
                  e.preventDefault();
                }) as any;
              }
            } else if (v.name === "img") {
              let src = v.attribs.src;
              if (!/^.+:\/\//.test(src)) {
                v.attribs.style = "cursor: pointer";
                if (src.startsWith("?")) {
                  if (!imagesIsSet) v.attribs.src = "";
                  else {
                    const toSearch = Object.fromEntries(
                      new URLSearchParams(src)
                    );
                    if (toSearch.image) {
                      const imageItem = imageItemList.find(({ originName }) =>
                        originName?.startsWith(toSearch.image)
                      );
                      if (imageItem?.URL) {
                        v.attribs.src = imageItem.URL;
                        v.attribs.title = imageItem.name;
                        v.attribs.alt = imageItem.name;
                        if ("keep" in toSearch) src = v.attribs.src;
                        else src = toSearch.image;
                      }
                    }
                  }
                }
                v.attribs.onClick = ((e: any) => {
                  router.push(
                    MakeURL({
                      query: {
                        ...Object.fromEntries(
                          new URLSearchParams(location.search)
                        ),
                        image: src,
                      },
                    }).href,
                    {
                      scroll: false,
                    }
                  );
                  e.preventDefault();
                }) as any;
              }
            }
          }
          return v;
        },
      });
    } else children = childString;
  } else {
    children = (
      <Twemoji tag={twemojiTag} options={{ className: "emoji" }}>
        {children}
      </Twemoji>
    );
  }
  className = (className ? `${className} ` : "") + parsedClassName;
  return React.createElement(tag, { className, ref: parsedRef }, children);
}

export default MultiParser;

"use client";

import React, { MutableRefObject, useLayoutEffect, useRef } from "react";
import HTMLReactParser, { htmlToDOM } from "html-react-parser";
import {
  ChildNode,
  Element as NodeElement,
  Text as NodeText,
} from "domhandler";
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
  if (typeof children === "string") {
    let childString = children;
    if (markdown) childString = parse(childString);
    if (toTwemoji) childString = twemoji.parse(childString);
    if (toDom) {
      let currentTag = "";
      children = HTMLReactParser(childString, {
        replace: (v) => {
          switch (v.type) {
            case "tag":
              switch (v.name) {
                case "a":
                  currentTag = v.name;
                  const url = v.attribs.href;
                  if (/^\w+:\/\//.test(url)) {
                    v.attribs.target = "_blank";
                    v.attribs.class =
                      (v.attribs.class ? `${v.attribs.class} ` : "") +
                      "external";
                  } else {
                    v.attribs.onClick = ((e: any) => {
                      const queryFlag = url.startsWith("?");
                      let query = queryFlag
                        ? Object.fromEntries(new URLSearchParams(url))
                        : {};
                      if (queryFlag) {
                        const scroll = query.scroll === "true";
                        if (query.scroll) delete query.scroll;
                        query = {
                          ...query,
                          ...Object.fromEntries(
                            new URLSearchParams(location.search)
                          ),
                        };
                        router.push(MakeURL({ query }).href, { scroll });
                      } else {
                        router.push(MakeURL(url).href);
                      }
                      e.preventDefault();
                    }) as any;
                  }
                  break;
                case "details":
                  if (detailsOpen && !("manual" in v.attribs))
                    v.attribs.open = "";
                  if (detailsClosable)
                    v.children.push(
                      new NodeElement(
                        "button",
                        {
                          className: "close",
                          onClick: ((e: any) => {
                            e.target.parentElement.removeAttribute("open");
                          }) as any,
                          title: "折りたたむ",
                        },
                        [new NodeText("たたむ")]
                      )
                    );
                  break;
                case "img":
                  let src = v.attribs.src;
                  if (!/^\w+:\/\//.test(src)) {
                    v.attribs.style = "cursor: pointer";
                    if (src.startsWith("?")) {
                      if (!imagesIsSet) v.attribs.src = "";
                      else {
                        const toSearch = Object.fromEntries(
                          new URLSearchParams(src)
                        );
                        if (toSearch.image) {
                          const imageItem = imageItemList.find(
                            ({ originName }) =>
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
                  break;
                default:
                  if (hashtag) {
                    const newChildren = v.children.reduce((a, n) => {
                      if (n.type === "text") {
                        if (!/^a$/.test(currentTag) && !/^\s*$/.test(n.data)) {
                          const replaced = n.data.replace(
                            /(^|\s?)(#[^\s#]+)/g,
                            (m, m1, m2) => {
                              const Url = MakeURL({
                                query: { q: m2 },
                              });
                              return `${m1}<a href="${
                                Url.pathname + Url.search
                              }">${m2}</a>`;
                            }
                          );
                          if (n.data !== replaced) {
                            htmlToDOM(replaced).forEach((n) => a.push(n));
                            return a;
                          }
                        }
                      }
                      a.push(n);
                      return a;
                    }, [] as ChildNode[]);
                    v.children = newChildren;
                  }
                  break;
              }
          }
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
  return React.createElement(tag, { className }, children);
}

export default MultiParser;

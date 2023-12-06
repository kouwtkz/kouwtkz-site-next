"use client";

import React from "react";
import Twemoji from "react-twemoji";
import HtmlParse from "html-react-parser";
import { parse } from "marked";
type MultiParserProps = {
  markdown?: boolean;
  toDom?: boolean;
  twemoji?: boolean;
  all?: boolean;
  className?: string;
  children?: React.ReactNode | string;
};
const MultiParser: React.FC<MultiParserProps> = ({
  markdown,
  toDom,
  twemoji,
  all,
  className,
  children,
}) => {
  if (typeof children === "string") {
    if (all) {
      markdown = true;
      toDom = true;
      twemoji = true;
    }
    let childString = children;
    if (markdown) childString = parse(childString);
    if (toDom) children = HtmlParse(childString);
    else children = childString;
  }
  if (twemoji)
    children = <Twemoji options={{ className: "emoji" }}>{children}</Twemoji>;
  if (className) children = <div className={className}>{children}</div>;
  return <>{children}</>;
};

export default MultiParser;

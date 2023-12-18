import React, { SVGAttributes } from "react";

export default function MenuButton(attributes: SVGAttributes<SVGSVGElement>) {
  const { className, ..._attributes } = attributes;
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        "MenuButton hover:cursor-pointer" + (className ? ` ${className}` : "")
      }
      {..._attributes}
    >
      <path
        className="fill-main"
        d="M0 0H60V60H0V0Z"
        fill="gray"
        fillOpacity="0.8"
      />
      <rect
        className="Line1"
        x="11"
        y="42"
        width="38"
        height="4"
        fill="white"
      />
      <rect
        className="Line2"
        x="11"
        y="28"
        width="38"
        height="4"
        fill="white"
      />
      <rect
        className="Line3"
        x="11"
        y="14"
        width="38"
        height="4"
        fill="white"
      />
    </svg>
  );
}

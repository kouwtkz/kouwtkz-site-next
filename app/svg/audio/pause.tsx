import React, { SVGAttributes } from "react";

export default function MenuButton(attributes: SVGAttributes<SVGSVGElement>) {
  const { className, ..._attributes } = attributes;
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      name="pause"
      className={className}
      {..._attributes}
    >
      <circle cx="18" cy="18" r="18" fill="black" />
      <rect x="9" y="9" width="6" height="18" fill="white" />
      <rect x="21" y="9" width="6" height="18" fill="white" />
    </svg>
  );
}

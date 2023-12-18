import React, { SVGAttributes } from "react";

export default function MenuButton({
  className,
  ...attributes
}: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      name="play"
      className={className}
      {...attributes}
    >
      <circle cx="18" cy="18" r="18" fill="black" />
      <path
        d="M30.5 17.7415L11 28.1338L11 7.34915L30.5 17.7415Z"
        fill="white"
      />
    </svg>
  );
}

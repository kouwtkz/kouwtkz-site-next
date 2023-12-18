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
      className={className}
      {...attributes}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36ZM30.4341 11.9025C30.1359 10.8038 29.4821 9.87375 28.3618 9.58125C26.3315 9.04875 18 9 18 9C18 9 9.66853 9.04875 7.63824 9.58125C6.51794 9.87375 5.86794 10.8038 5.56588 11.9025C5.02294 13.8938 5 18 5 18C5 18 5.02294 22.1063 5.56588 24.0975C5.86412 25.1962 6.51794 26.1263 7.63824 26.4188C9.66853 26.9513 18 27 18 27C18 27 26.3315 26.9513 28.3618 26.4188C29.4821 26.1263 30.1359 25.1962 30.4341 24.0975C30.9771 22.1063 31 18 31 18C31 18 30.9771 13.8938 30.4341 11.9025ZM24.4706 18L13.8824 12.1667V23.8333L24.4706 18Z"
        fill="black"
      />
    </svg>
  );
}

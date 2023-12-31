import React, { SVGAttributes } from "react";

type PlayPauseButtonProps = {
  isPause?: boolean;
} & SVGAttributes<SVGSVGElement>;

const PausePath = React.memo(function PausePath() {
  return (
    <g fill="white">
      <rect x="9" y="9" width="6" height="18" />
      <rect x="21" y="9" width="6" height="18" />
    </g>
  );
});
const PlayPath = React.memo(function PlayPath() {
  return (
    <g fill="white">
      <path d="M30.5 17.7415L11 28.1338L11 7.34915L30.5 17.7415Z" />
    </g>
  );
});

export default function PlayPauseButton({
  className,
  fill,
  isPause = true,
  ...attributes
}: PlayPauseButtonProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      name="pause"
      className={className}
      {...attributes}
    >
      <circle cx="18" cy="18" r="18" className={fill || "fill-main-soft"} />
      {isPause ? <PlayPath /> : <PausePath />}
    </svg>
  );
}

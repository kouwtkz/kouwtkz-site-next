import { LoopMode } from "@/app/sound/MediaSoundType";
import React, { SVGAttributes } from "react";

type LoopButtonProps = {
  loopMode?: LoopMode;
} & SVGAttributes<SVGSVGElement>;

export default function LoopButton({
  className,
  fill,
  loopMode = "off",
  ...attributes
}: LoopButtonProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      name="loop"
      className={className}
      {...attributes}
    >
      <circle cx="18" cy="18" r="18" className={fill || "fill-main-soft"} />
      {loopMode === "playUntilEnd" ? (
        <path
          className="playUntilEnd"
          d="M7 13.2L17 13.2V6L31 18L17 30V22.8L7 22.8V13.2Z"
          fill="white"
        />
      ) : (
        <>
          <path
            d="M17.9043 11.5833C14.3913 11.5833 11.5435 14.4562 11.5435 18C11.5435 21.5438 14.3913 24.4167 17.9043 24.4167C19.6842 24.4167 21.2933 23.6792 22.4478 22.4907L25.6606 25.7317C23.6838 27.7496 20.9388 29 17.9043 29C11.882 29 7 24.0751 7 18C7 11.9249 11.882 7 17.9043 7C20.9388 7 23.6838 8.25038 25.6606 10.2683C25.6606 10.2683 27.1721 8.80015 28.4762 7.52381L29 17.45L19.5 16.5L22.4478 13.5093C21.2933 12.3208 19.6842 11.5833 17.9043 11.5833Z"
            fill="white"
          />
          {loopMode === "loopOne" ? (
            <g>
              <path
                d="M26.5 29.9923V18.9974C26.5 18.1204 26.2625 17.1972 25.5793 16.4905C24.8875 15.7749 23.9507 15.5 23.0036 15.5H21.0072C20.3932 15.5 19.7061 15.6801 19.1793 16.2213C18.6592 16.7556 18.5 17.4317 18.5 18.0077V18.9974C18.5 19.5734 18.6592 20.2496 19.1793 20.7838C19.5633 21.1783 20.0325 21.3809 20.4964 21.4618V29.9923C20.4964 30.606 20.6762 31.293 21.217 31.8201C21.7511 32.3405 22.4274 32.5 23.0036 32.5H23.9928C24.569 32.5 25.2453 32.3405 25.7794 31.8201C26.3202 31.293 26.5 30.606 26.5 29.9923Z"
                className="fill-main"
                strokeWidth="3"
              />
              <path
                d="M25 18.9974V29.9923C25 30.6581 24.6223 31 23.9928 31H23.0036C22.3741 31 21.9964 30.6581 21.9964 29.9923V20.509C21.9964 20.2031 21.8345 20.0051 21.4928 20.0051H21.0072C20.3417 20.0051 20 19.6272 20 18.9974V18.0077C20 17.3779 20.3417 17 21.0072 17H23.0036C24.3345 17 25 17.7558 25 18.9974Z"
                fill="white"
              />
            </g>
          ) : null}
          {loopMode === "off" ? (
            <path d="M29 7L7 29" stroke="white" strokeWidth="4" />
          ) : null}
        </>
      )}
    </svg>
  );
}

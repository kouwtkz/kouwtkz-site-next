import React from "react";
import { result } from "@/media/scripts/MediaData";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-wrap max-w-[1120px] mx-auto">
      {result.list.map((info, key) => {
        return (
          <div key={key} className="w-[24.532%] pt-[24.532%] m-[0.234%] relative">
              <Image
                src={`${result.path}/${info.src || ""}`}
                alt={info.name || info.src}
                width={340}
                height={340}
                objectFit="fill"
                className="absolute w-[100%] h-[100%] top-0 object-cover"
              />
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { ImageMeeThumbnail } from "../components/image/ImageMee";
import { useCharaState } from "./CharaState";

export default function CharaList() {
  const { charaList } = useCharaState();
  return (
    <div className="flex flex-row flex-wrap justify-center content-around w-[90%] max-w-4xl mx-auto">
      {charaList.map((chara, index) => {
        return (
          <Link
            key={index}
            className="block p-4 w-[50%] sm:w-[33%] hover:bg-main-pale-fluo hover:text-main-deep"
            href={`character?name=${chara.id}`}
          >
            {chara.media?.image ? (
              <ImageMeeThumbnail
                imageItem={chara.media.image}
                className="block mx-auto my-2 max-w-[90%]"
                loadingScreen={true}
              />
            ) : null}
            <div className="text-center text-xl md:text-2xl">{chara.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

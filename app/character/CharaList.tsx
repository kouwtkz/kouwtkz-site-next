"use client";

import Link from "next/link";
import ImageMee from "../components/image/ImageMee";
import { useCharaState } from "./CharaState";

export default function CharaList() {
  const { charaList } = useCharaState();
  return (
    <div className="flex flex-row flex-wrap justify-center content-around">
      {charaList.map((chara, index) => {
        return (
          <Link
            key={index}
            className="block p-4 w-[30%] hover:bg-main-pale-fluo hover:text-main-dark"
            href={`character/${chara.id}`}
          >
            {chara.media?.image ? (
              <ImageMee
                imageItem={chara.media.image}
                mode="thumbnail"
                className="block mx-auto my-2 max-w-[82%]"
              />
            ) : null}
            <div className="text-center text-3xl">{chara.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

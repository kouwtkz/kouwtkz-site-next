import React from "react";
import { charaList } from "./getCharaData";
import CharaListItem from "./client/listItem";
import { getImageItem } from "@/app/media/image/MediaImageData.mjs";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      {Object.entries(charaList).map(async ([name, chara], index) => {
        return (
          <div key={index} className="m-4 h-8 inline-block">
            <CharaListItem
              chara={chara}
            />
          </div>
        );
      })}
    </div>
  );
}

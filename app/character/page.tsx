import React from "react";
import { charaList } from "./[name]/getList";
import CharaListItem from "../components/character/listItem";
import { isStatic } from "@/app/functions/general";
import { getImageItem } from "@/media/scripts/MediaImageData.mjs";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      {Object.entries(charaList).map(([name, chara], index) => {
        return (
          <div key={index} className="m-4 h-8 inline-block">
            <CharaListItem
              chara={chara}
              isStatic={isStatic}
              iconImage={
                chara.icon
                  ? getImageItem({
                      filter: { albumName: "charaIcon", pathMatch: chara.icon },
                    })
                  : null
              }
            />
          </div>
        );
      })}
    </div>
  );
}

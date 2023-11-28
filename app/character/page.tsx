import React from "react";
import { charaList } from "./[name]/getList";
import CharaListItem from "../components/character/listItem";
import { isStatic } from "@/siteData/site";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      {Object.entries(charaList).map(([name, chara], index) => {
        return (
          <div key={index} className="m-4 h-8 inline-block">
            <CharaListItem chara={chara} isStatic={isStatic} />
          </div>
        );
      })}
    </div>
  );
}

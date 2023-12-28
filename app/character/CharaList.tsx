"use client";

import CharaListItem from "./CharaListItem";
import { useCharaData } from "./CharaData";

export default function CharaList() {
  const { charaList } = useCharaData();
  return (
    <>
      {charaList.map((chara, index) => {
        return (
          <div key={index} className="m-4 h-8 inline-block">
            <CharaListItem chara={chara} />
          </div>
        );
      })}
    </>
  );
}

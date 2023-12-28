"use client";

import CharaListItem from "./CharaListItem";
import { useCharaState } from "./CharaState";

export default function CharaList() {
  const { charaList } = useCharaState();
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

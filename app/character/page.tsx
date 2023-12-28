import React from "react";
import CharaList from "./CharaList";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      <CharaList />
    </div>
  );
}

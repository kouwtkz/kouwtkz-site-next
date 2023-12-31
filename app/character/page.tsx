import React from "react";
import CharaList from "./CharaList";

export default function Page() {
  return (
    <div>
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      <CharaList />
    </div>
  );
}

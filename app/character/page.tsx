import React from "react";
import CharaList from "./CharaList";
import { Metadata } from "next";
const title = "Character".toUpperCase();
export const metadata: Metadata = { title };

export default function Page() {
  return (
    <div>
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8">
        {title}
      </h1>
      <CharaList />
    </div>
  );
}

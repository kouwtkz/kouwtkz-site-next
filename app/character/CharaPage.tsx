"use client";

import React from "react";
import CharaList from "./CharaList";
import { useSearchParams } from "next/navigation";
import CharaDetail from "./CharaDetail";

interface CharaObjectProps {
  title?: string;
}

export default function CharaPage({ title }: CharaObjectProps) {
  const search = useSearchParams();
  const name = search.get("name");
  if (name) {
    return <CharaDetail name={name} />;
  } else {
    return (
      <div>
        <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8">
          {title}
        </h1>
        <CharaList />
      </div>
    );
  }
}

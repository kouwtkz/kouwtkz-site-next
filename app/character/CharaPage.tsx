"use client";

import React from "react";
import CharaList from "./CharaList";
import { useSearchParams } from "next/navigation";
import CharaDetail from "./CharaDetail";
import CharaEditButton from "./CharaEditButton";
import CharaEditForm from "./CharaEditForm";

interface CharaObjectProps {
  title?: string;
}

export default function CharaPage({ title }: CharaObjectProps) {
  const search = useSearchParams();
  const name = search.get("name");
  const mode = search.get("mode");
  switch (mode) {
    case "add":
    case "edit":
      return <CharaEditForm />;
    default:
      return (
        <>
          <CharaEditButton name={name} />
          {name ? (
            <CharaDetail name={name} />
          ) : (
            <div>
              <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-8">
                {title}
              </h1>
              <CharaList />
            </div>
          )}
        </>
      );
  }
}

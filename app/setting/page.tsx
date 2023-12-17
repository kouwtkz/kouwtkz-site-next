import Link from "next/link";
import React from "react";
import { ChangeThemeButton } from "./ChangeTheme";

export default async function Page() {
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">SETTING</h1>
      <ul className="[&>li]:m-4">
        <li>
          <ChangeThemeButton />
        </li>
      </ul>
    </div>
  );
}

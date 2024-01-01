import React from "react";
import { ChangeThemeButton } from "./ChangeTheme";
import { Metadata } from "next";
const title = "SETTING";
export const metadata: Metadata = { title };

export default async function Page() {
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">{title}</h1>
      <ul className="[&>li]:m-4">
        <li>
          <ChangeThemeButton />
        </li>
      </ul>
    </div>
  );
}

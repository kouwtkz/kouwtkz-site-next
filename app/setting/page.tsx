import Link from "next/link";
import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ChangeThemeButton } from "./ChangeTheme";

export default async function Page() {
  const currentUser = await getCurrentUser();
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">SETTING</h1>
      <ul className="[&>li]:m-4">
        <li>
          <ChangeThemeButton />
        </li>
        { currentUser ? (
        <li>
          <Link href="setting/owner" className="button text-2xl">
            かんりしつ
          </Link>
        </li>
        ) : (
        <li>
          <Link href="setting/login" className="button text-2xl">
            かんりにんログイン
          </Link>
        </li>
        ) }
      </ul>
    </div>
  );
}

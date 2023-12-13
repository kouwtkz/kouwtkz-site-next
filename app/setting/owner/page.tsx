import Link from "next/link";
import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
import SignoutLink from "./SignoutLink";

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/setting/login`);
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">OWNER ROOM</h1>
      <ul className="[&>li]:m-4">
        <li>
          <Link href="/setting/owner/edit/profile" className="button text-2xl">
            プロフィール編集
          </Link>
        </li>
        <li>
          <Link href="/setting/owner/edit/account" className="button text-2xl">
            アカウント設定
          </Link>
        </li>
        <li>
          <SignoutLink />
        </li>
      </ul>
    </div>
  );
}

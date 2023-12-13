import Link from "next/link";
import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AccountEdit from "./AccountEdit";

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/setting/login`);
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">ACCOUNT EDIT</h1>
      <AccountEdit currentUser={currentUser} />
    </div>
  );
}

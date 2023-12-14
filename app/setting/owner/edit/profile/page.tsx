import Link from "next/link";
import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";
import ProfileEdit from "./ProfileEdit";

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/setting/login`);
  return (
    <div className="pt-4">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">PROFILE EDIT</h1>
      <ProfileEdit currentUser={currentUser} />
    </div>
  );
}
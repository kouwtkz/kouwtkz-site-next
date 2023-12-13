import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/setting/login/edit/profile");
  else redirect("/setting/login");
  return null;
}

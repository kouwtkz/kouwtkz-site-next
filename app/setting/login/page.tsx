import React from "react";
import LoginForm from "./LoginForm";
import isStatic from "@/app/components/System/isStatic.mjs";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  return <LoginForm redirect={isStatic ? "" : searchParams["redirect"]} />;
}

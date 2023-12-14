import React from "react";
import LoginForm from "./LoginForm";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  return <LoginForm redirect={searchParams["redirect"]} />;
}

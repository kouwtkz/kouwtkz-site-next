import React from "react";
import isStatic from "@/app/components/System/isStatic.mjs";
import CurrentUser from "./CurrentUser";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function ServerStateMake() {
  if (isStatic) {
    return <></>;
  } else {
    return <CurrentUser user={await getCurrentUser()} />;
  }
}

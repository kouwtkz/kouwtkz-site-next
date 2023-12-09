import React from "react";
import isStatic from "./isStatic.mjs";
import ServerState from "./ServerState";

export default function ServerStateMake() {
  return <ServerState isStatic={isStatic} />;
}

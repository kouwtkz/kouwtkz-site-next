import React from "react";
import isStatic from "./isStatic.mjs";
import ServerState from "./ServerState";

const ServerStateMake = () => {
  return <ServerState isStatic={isStatic} />;
}

export default ServerStateMake;
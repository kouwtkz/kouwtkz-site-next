"use client";
import React from "react";
import { create } from "zustand";

type ServerStateType = {
  set: boolean;
  isStatic: boolean;
  setIsStatic: (value: boolean) => void;
};

export const useServerState = create<ServerStateType>((set) => ({
  set: false,
  isStatic: false,
  setIsStatic: (value) => {
    set({ isStatic: value, set: true });
  },
}));

type ServerStateProps = {
  isStatic: boolean;
};

const ServerState = ({ isStatic }: ServerStateProps) => {
  const serverData = useServerState();
  if (!serverData.set) serverData.setIsStatic(isStatic);
  return <></>;
};

export default ServerState;

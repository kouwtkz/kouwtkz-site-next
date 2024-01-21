"use client";
import React from "react";
import { create } from "zustand";

type ServerStateType = {
  set: boolean;
  isStatic: boolean;
  isProduction: boolean;
  isServerMode: boolean;
  setIsStatic: (value: boolean) => void;
};

export const useServerState = create<ServerStateType>((set) => ({
  set: false,
  isStatic: true,
  isProduction: process.env.NODE_ENV === "production",
  isServerMode: false,
  setIsStatic: (value) => {
    set((state) => ({ isStatic: value, isServerMode: !(value && state.isProduction) , set: true }));
  },
}));

type ServerStateProps = {
  isStatic: boolean;
};

export default function ServerState({ isStatic }: ServerStateProps) {
  
  const serverData = useServerState();
  if (!serverData.set) serverData.setIsStatic(isStatic);
  return <></>;
}

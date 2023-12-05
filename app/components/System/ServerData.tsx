"use client";
import React from "react";
import { create } from "zustand";

type ServerDataType = {
  set: boolean;
  isStatic: boolean;
  setIsStatic: (value: boolean) => void;
};

export const useServerData = create<ServerDataType>((set) => ({
  set: false,
  isStatic: false,
  setIsStatic: (value) => {
    set({ isStatic: value, set: true });
  },
}));

type ServerDataProps = {
  isStatic: boolean;
};

const ServerData = ({ isStatic }: ServerDataProps) => {
  const serverData = useServerData();
  if (!serverData.set) serverData.setIsStatic(isStatic);
  return <></>;
};

export default ServerData;

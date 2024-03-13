"use client";
import { create } from "zustand";

type SystemStateType = {
  date: Date;
};

export const useSystemState = create<SystemStateType>((set) => ({
  date: new Date(),
}));

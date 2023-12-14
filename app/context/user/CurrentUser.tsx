"use client";
import React, { useEffect } from "react";
import { create } from "zustand";
import { User } from "@prisma/client";

type CurrentUserType = {
  set: boolean;
  user: User | null;
  setUser: (user: User) => void;
};

export const useCurrentUser = create<CurrentUserType>((set) => ({
  set: false,
  user: null,
  setUser: (user) => {
    set({ user, set: true });
  },
}));

type ServerStateProps = {
  user: User | null;
};

export default function CurrentUser({ user }: ServerStateProps) {
  const currentUser = useCurrentUser();
  useEffect(() => {
    if (!currentUser.set && user) currentUser.setUser(user);
  });
  return <></>;
}

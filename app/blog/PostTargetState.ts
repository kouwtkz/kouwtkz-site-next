import { create } from "zustand";
import { Post } from "@prisma/client";

type PostTargetState = {
  postTarget: Post | null;
  setPostTarget: (post?: Post | null) => void;
};

export const usePostTargetState = create<PostTargetState>((set) => ({
  postTarget: null,
  setPostTarget: (post) => {
    set({ postTarget: post || null });
  },
}));

"use client";
import React, { useEffect } from "react";
import { Post } from "./Post.d";
import { create } from "zustand";

type PostStateType = {
  set: boolean;
  posts: Post[];
  setPosts: (value: any) => void;
};

function parsePosts(posts: Post[]) {
  posts.forEach((post) => {
    post.date = new Date(post.date);
    post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null;
  });
  return posts;
}
export const usePostState = create<PostStateType>((set) => ({
  set: false,
  posts: [],
  setPosts: (value) => {
    set(() => ({ posts: parsePosts(value), set: true }));
  },
}));

export default function PostState({ buildTime = new Date().getTime() }) {
  const postsData = usePostState();
  useEffect(() => {
    if (!postsData.set)
      fetch(`${location?.origin}/post.json?v=${buildTime}`)
        .then((d) => d.json())
        .then((json) => {
          if (!postsData.set) {
            postsData.setPosts(json);
          }
        });
  });

  return <></>;
}

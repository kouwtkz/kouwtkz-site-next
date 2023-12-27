"use client";
import React, { useEffect, useRef } from "react";
import { Post } from "./Post.d";
import { create } from "zustand";
import { DataStateReplacedProps } from "@/app/components/dataState/DataStateFunctions";
import axios from "axios";
const defaultUrl = "/blog/posts.json";

function parsePosts(posts: Post[]) {
  posts.forEach((post) => {
    post.date = new Date(post.date);
    post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null;
  });
  return posts;
}
type PostStateType = {
  posts: Post[];
  setPosts: (value: any) => void;
  setPostsFromUrl: (url?: string) => void;
};
export const usePostState = create<PostStateType>((set) => ({
  posts: [],
  setPosts: (value) => {
    set(() => ({ posts: parsePosts(value), set: true }));
  },
  setPostsFromUrl: (url = defaultUrl) => {
    set((state) => {
      axios(url).then((r) => {
        state.setPosts(r.data);
      });
      return state;
    });
  },
}));

export default function PostState({ url }: DataStateReplacedProps) {
  const postsData = usePostState();
  const setPost = useRef(false);
  useEffect(() => {
    if (!setPost.current) {
      postsData.setPostsFromUrl(url);
      setPost.current = true;
    }
  });

  return <></>;
}

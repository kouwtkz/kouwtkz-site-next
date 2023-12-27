"use client";
import React, { useEffect, useRef } from "react";
import { Post } from "./Post.d";
import { create } from "zustand";
import { DataStateReplacedProps } from "@/app/components/dataState/DataStateFunctions";
import axios from "axios";

type PostStateType = {
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
  posts: [],
  setPosts: (value) => {
    set(() => ({ posts: parsePosts(value), set: true }));
  },
}));

export default function PostState({ url }: DataStateReplacedProps) {
  const postsData = usePostState();
  const setPost = useRef(false);
  useEffect(() => {
    if (!setPost.current)
      axios(url).then((r) => {
        postsData.setPosts(r.data);
        setPost.current = true;
      });
  });

  return <></>;
}

"use client";
import React, { useEffect, useRef } from "react";
import { Post } from "./Post.d";
import { create } from "zustand";
import axios from "axios";
export const defaultUrl = "/blog/posts.json";

function parsePosts(posts: Post[]) {
  posts.forEach((post) => {
    post.date = post.date ? new Date(post.date) : null;
    post.updatedAt = post.updatedAt ? new Date(post.updatedAt) : null;
  });
  return posts;
}
type PostStateType = {
  posts: Post[];
  isSet: boolean;
  url: string;
  setPosts: (value: any) => void;
  setUrl: (url?: string, setPosts?: boolean) => void;
  setPostsFromUrl: (url?: string) => void;
  isSetCheck: () => void;
};
export const usePostState = create<PostStateType>((set) => ({
  posts: [],
  isSet: false,
  url: defaultUrl,
  setPosts(value) {
    set(() => ({ posts: parsePosts(value), isSet: true }));
  },
  setUrl(url = defaultUrl, setPostsFlag = true) {
    if (setPostsFlag) {
      set((state) => {
        state.setPostsFromUrl(url);
        return state;
      });
    } else {
      set(() => {
        return { url };
      });
    }
  },
  setPostsFromUrl(url) {
    set((state) => {
      axios(url || state.url).then((r) => {
        state.setPosts(r.data);
      });
      return url ? { url } : state;
    });
  },
  isSetCheck() {
    set((state) => {
      if (!state.isSet) state.setPostsFromUrl();
      return state;
    });
  },
}));

export default function PostState({
  url,
  dataSet,
}: {
  url: string;
  dataSet?: boolean;
}) {
  const postsData = usePostState();
  const isSet = useRef(false);
  useEffect(() => {
    if (!isSet.current) {
      postsData.setUrl(url, dataSet);
      isSet.current = true;
    }
  });

  return <></>;
}

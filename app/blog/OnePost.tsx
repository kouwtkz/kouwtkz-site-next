"use client";
import { Post, User } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import Link from "next/link";
type Props = {
  post: Post & { user: { name: string | null; icon: string | null } | null };
};

export default function OnePost({ post }: Props) {
  return (
    <div className="m-4">
      <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
        <Link href={`/blog/post/${post.postId}`}>{post.title}</Link>
      </h3>
      <span className="underline">
        <Link href={`/blog/?q=category:${post.category}`}>{post.category}</Link>
      </span>
      <MultiParser>{post.body}</MultiParser>
    </div>
  );
}

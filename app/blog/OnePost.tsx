import { Post, User } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import Link from "next/link";
type Props = {
  isStatic: boolean;
  post: Post & { user: { name: string | null; icon: string | null } | null };
};

export default function OnePost({ post, isStatic }: Props) {
  return (
    <div className="m-4">
      <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
        <Link href={`/blog/post/${post.postId}`}>{post.title}</Link>
      </h3>
      <span className="underline">
        <Link href={`/blog/?q=category:${post.category}`}>{post.category}</Link>
      </span>
      {isStatic ? null : <MultiParser>{post.body}</MultiParser>}
    </div>
  );
}

import { Post, User } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import Link from "next/link";
import date_format from "@/app/components/functions/date_format";
type Props = {
  isStatic: boolean;
  post: Post & { user: { name: string | null; icon: string | null } | null };
};

export default function OnePost({ post, isStatic }: Props) {
  const formattedDate = date_format("Y/m/d H:i", post.date, true);
  return (
    <div className="m-4">
      <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
        <Link href={`/blog/post/${post.postId}`}>
          {post.title || formattedDate}
        </Link>
      </h3>
      <div className="underline inline-block">
        <Link href={`/blog/?q=category:${post.category}`}>{post.category}</Link>
      </div>
      {isStatic ? null : <MultiParser>{post.body}</MultiParser>}
      <div className="text-right [&>*]:ml-4">
        <span className="text-main">{post.user?.name}</span>
        <Link
          className="text-main-grayish hover:text-main-grayish-fluo"
          href={`/blog/post/${post.postId}`}
        >
          {formattedDate}
        </Link>
      </div>
    </div>
  );
}

import { Post, User } from "@prisma/client";
import MultiParser from "@/app/components/functions/MultiParser";
import Link from "next/link";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";
type Props = {
  isStatic: boolean;
  post: Post & { user: { name: string | null; icon: string | null } | null };
};

export default function OnePost({ post, isStatic }: Props) {
  const formattedDate = post.date ? post.date.toLocaleString("ja", opt) : "";
  return (
    <div className="mx-4 my-6">
      {post.pin !== 0 ? (
        post.pin > 0 ? (
          <div className="text-main-strong">▼ 固定された投稿</div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {post.title ? (
        <h3 className="text-2xl text-main-dark font-bold inline-block m-2">
          <Link href={`/blog/post/${post.postId}`}>{post.title}</Link>
        </h3>
      ) : (
        <></>
      )}
      {post.category ? (
        <div className="underline inline-block">
          <Link href={`/blog/?q=category:${post.category}`}>
            {post.category}
          </Link>
        </div>
      ) : (
        <></>
      )}
      {isStatic ? null : <MultiParser>{post.body}</MultiParser>}
      <div className="text-right [&>*]:ml-4">
        {post.draft ? (
          <span className="text-main-grayish">(下書き)</span>
        ) : post.date.getTime() > Date.now() ? (
          <span className="text-main-grayish">(予約)</span>
        ) : (
          <></>
        )}
        <span className="text-main">{post.user?.name}</span>
        {formattedDate ? (
          <Link
            className="text-main-grayish hover:text-main-grayish-fluo"
            href={`/blog/post/${post.postId}`}
          >
            {formattedDate}
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

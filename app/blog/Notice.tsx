import Link from "next/link";
import MultiParser from "../components/functions/MultiParser";
import { usePostState } from "./PostState";
import { findMany } from "./functions/findMany";
import { HTMLAttributes } from "react";

type NoticeProps = {
  take?: number;
} & HTMLAttributes<HTMLDivElement>;

export default function Notice({
  take = 3,
  className,
  ...attributes
}: NoticeProps) {
  const { posts } = usePostState();
  const topPosts = findMany({
    list: posts,
    take,
    where: { category: "お知らせ" },
  });
  return (
    <div className={"my-8" + className ? ` ${className}` : ""} {...attributes}>
      <h3 className="text-2xl my-4">お知らせ</h3>
      <div className="my-4">
        {topPosts.map((post, i) => (
          <div className="m-1" key={i}>
            <Link href={`/blog?postId=${post.postId}`}>
              <MultiParser only={{ toTwemoji: true }}>{post.title}</MultiParser>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import MultiParser from "@/app/components/functions/MultiParser";
import { usePostState } from "../PostState";
import { findMany, findManyProps } from "../functions/findMany.mjs";
import { HTMLAttributes, ReactNode } from "react";
import { Post } from "../Post";

type PostListWindowProps = {
  heading?: string | ReactNode;
  options?: findManyProps<Post>;
} & HTMLAttributes<HTMLDivElement>;

export default function PostListWindow({
  heading = "NEW POSTS",
  options,
  ...attributes
}: PostListWindowProps) {
  if (typeof heading === "string")
    heading = <h3 className="text-2xl my-4">{heading}</h3>;
  const { posts } = usePostState();
  const topPosts = findMany({ take: 3, ...options, list: posts });
  return (
    <div {...attributes}>
      {heading}
      <div className="my-4">
        {topPosts.map((post, i) => (
          <Link
            className="m-1 flex flex-row justify-center items-center"
            href={`/blog?postId=${post.postId}`}
            key={i}
          >
            <div className="flex-1 text-right mr-2">{post.date.toLocaleDateString("ja")}</div>
            <MultiParser className="flex-[3] text-left" only={{ toTwemoji: true }}>
              {post.title}
            </MultiParser>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NoticeWindow({
  options = {},
  category = "notice",
  ...args
}: PostListWindowProps & { category?: string }) {
  options = { where: { category }, ...options };
  return PostListWindow({ heading: "NOTICE", ...args });
}

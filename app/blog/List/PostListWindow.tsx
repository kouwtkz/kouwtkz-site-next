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
  heading = null,
  options,
  ...attributes
}: PostListWindowProps) {
  if (typeof heading === "string")
    heading = <h3 className="text-2xl my-4">{heading}</h3>;
  const { posts } = usePostState();
  const topPosts = findMany({ take: 3, ...options, list: posts });
  return (
    <>
      {heading}
      <div {...attributes}>
        {topPosts.map((post, i) => (
          <Link
            className="mx-2 my-1 flex flex-row justify-left items-center"
            href={{ pathname: "/blog", query: { postId: post.postId } }}
            prefetch={false}
            key={i}
          >
            <div className="text-right mr-2 min-w-[5em]">
              {post.date.toLocaleDateString("ja")}
            </div>
            <MultiParser className="text-left" only={{ toTwemoji: true }}>
              {post.title}
            </MultiParser>
          </Link>
        ))}
      </div>
    </>
  );
}

export function NoticeWindow({
  options = {},
  category = "notice",
  ...args
}: PostListWindowProps & { category?: string }) {
  options = { where: { category: { contains: category } }, ...options };
  return PostListWindow({ heading: "NOTICE", ...args });
}

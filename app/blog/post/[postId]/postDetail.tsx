"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Twemoji from "react-twemoji";
import { Post } from "@prisma/client";
import HtmlParse from "html-react-parser";
import { parse } from "marked";
import { useServerData } from "@/app/components/System/ServerData";

type PostDetailProps = {
  post?: Post;
};

const TopPage: React.FC<PostDetailProps> = ({ post }) => {
  const { isStatic } = useServerData();
  if (!post) return null;
  return (
    <div className="text-lg">
      <Link href="/blog">
        <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
          MINI BLOG
        </h2>
      </Link>
      <Twemoji options={{ className: "emoji" }}>
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          <div>
            <h1 className="text-4xl text-main-deep font-bold mx-2 my-4 inline-block">
              {post.title}
            </h1>
            <span className="mx-3 underline">
              <Link href={`/blog/?q=%23${post.category}`}>{post.category}</Link>
            </span>
          </div>
          <div className="[&_p]:my-4 [&_p]:whitespace-pre-line">{HtmlParse(parse(post.body))}</div>
        </div>
      </Twemoji>
    </div>
  );
};

export default TopPage;

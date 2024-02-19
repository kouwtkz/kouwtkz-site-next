import Link from "next/link";
import PostsPage from "./PostsPage";
import { Metadata } from "next";
import { Suspense } from "react";
import { TbRss } from "react-icons/tb";
const title = "BLOG";
export const metadata: Metadata = { title };

export default async function BlogPage({}: {}) {
  return (
    <>
      <div>
        <div className="mt-6 pt-8 mb-12 flex justify-center items-baseline align-text-bottom">
          <Link href="/blog" className="inline-block" title="ブログトップ">
            <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main">
              MINI BLOG
            </h2>
          </Link>
          <Link
            title="RSSフィード"
            className="inline-block text-lg ml-3 sm:text-xl sm:ml-4"
            target="_blank"
            href="/blog/rss.xml"
            prefetch={false}
          >
            <TbRss />
          </Link>
        </div>
        <Suspense>
          <PostsPage />
        </Suspense>
      </div>
    </>
  );
}

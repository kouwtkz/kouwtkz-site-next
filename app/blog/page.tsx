import Link from "next/link";
import StaticBlogPage from "./StaticBlogPage";
import { Metadata } from "next";
const title = "BLOG";
export const metadata: Metadata = { title };

export default async function BlogPage({}: {}) {
  return (
    <>
      <div>
        <Link href="/blog">
          <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
            MINI BLOG
          </h2>
        </Link>
        <StaticBlogPage />
        <div className="mt-8">
          <a target="_blank" href="/blog/rss.xml">
            RSSフィード
          </a>
        </div>
      </div>
    </>
  );
}

import { Suspense } from "react";
import { BlogPage } from "./PostsPage";
import { Metadata } from "next";
const title = "BLOG";
export const metadata: Metadata = { title };

export default async function Page({}: {}) {
  return (
    <Suspense>
      <BlogPage
        title={title}
        blogEnable={process.env.BLOG_ENABLE !== "false"}
      />
    </Suspense>
  );
}

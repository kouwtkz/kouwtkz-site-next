import PostForm from "./PostForm";
import { Suspense } from "react";
import { Metadata } from "next";
const title = "POST FORM";
export const metadata: Metadata = { title };

export default async function postPage({}: {}) {
  return (
    <Suspense>
      <PostForm />
    </Suspense>
  );
}

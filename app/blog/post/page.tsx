import PostForm from "./PostForm";
import { Suspense } from "react";

type ParamsType = { [key: string]: string | undefined };
export default async function postPage({}: {}) {
  return (
    <Suspense>
      <PostForm />
    </Suspense>
  );
}

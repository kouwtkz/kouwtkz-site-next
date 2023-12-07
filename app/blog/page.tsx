// オリジナルタグを使用したい場合は定義元は必ずuse clientのものとなる
import getPosts from "./functions/getPosts";
import isStatic from "@/app/components/System/isStatic.mjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckPostId from "./CheckPostId";
import { Suspense } from "react";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const redirectPostId =
    !isStatic && searchParams.postId ? searchParams.postId : undefined;
  if (redirectPostId) redirect(`/blog/post/${redirectPostId}`);
  // 投稿一覧取得
  const posts = await getPosts({ max: 10 });

  return (
    <div>
      {isStatic ? (
        <Suspense>
          <CheckPostId />
        </Suspense>
      ) : null}
      <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
        MINI BLOG
      </h2>
      <div className="w-[100%] md:w-[80%] mx-auto">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            return (
              <div key={index} className="m-4">
                <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
                  <Link href={`/blog/post/${post.postId}`}>{post.title}</Link>
                </h3>
                <span className="underline">
                  <Link href={`/blog/?q=%23${post.category}`}>
                    {post.category}
                  </Link>
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center">投稿はありません</div>
        )}
      </div>
    </div>
  );
}

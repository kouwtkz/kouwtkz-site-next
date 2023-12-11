// オリジナルタグを使用したい場合は定義元は必ずuse clientのものとなる
import getPosts from "./functions/getPosts";
import isStatic from "@/app/components/System/isStatic.mjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckPostId from "./CheckPostId";
import Fixed from "./Fixed";
import OnePost from "./OnePost";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const redirectPostId = isStatic ? undefined : searchParams.postId;
  if (redirectPostId) redirect(`/blog/post/${redirectPostId}`);
  const page = isStatic ? undefined : Number(searchParams.p);
  const q = isStatic ? undefined : searchParams.q;
  // 投稿一覧取得
  const take = isStatic ? 200 : 5;
  const { posts, count, max } = await getPosts({ take, page, q });

  return (
    <>
      {isStatic ? <CheckPostId /> : null}
      {!isStatic ? <Fixed isStatic={isStatic} max={max} /> : null}
      <div>
        <Link href="/blog">
          <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
            MINI BLOG
          </h2>
        </Link>
        <div className="w-[98%] md:w-[80%] max-w-3xl text-left mx-auto">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <OnePost post={post} isStatic={isStatic} key={index} />
            ))
          ) : (
            <div className="text-center">投稿はありません</div>
          )}
        </div>
      </div>
    </>
  );
}

// オリジナルタグを使用したい場合は定義元は必ずuse clientのものとなる
import getPosts from "@/app/api/blog/getPosts";
import { isStatic } from "@/siteData/site";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckPostId from "./CheckPostId";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const renderList = [];
  const postId =
    !isStatic && searchParams.postId ? searchParams.postId : undefined;
  if (postId) {
    redirect(`/blog/${postId}`);
  } else if (isStatic) {
    renderList.push(<CheckPostId />);
  }
  const q = !isStatic && searchParams.q ? searchParams.q : undefined;
  // 投稿一覧取得
  const posts = await getPosts({ max: 10 });

  // 投稿がない場合
  if (posts.length === 0) {
    renderList.push(<div className="text-center">投稿はありません</div>);
    return renderList;
  }
  renderList.push(
    <div>
      <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
        MINI BLOG
      </h2>
      <div className="w-[80%] mx-auto">
        {posts.map((post, index) => {
          return (
            <div key={index} className="m-4">
              <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
                <Link href={`/blog/${post.postId}`}>{post.title}</Link>
              </h3>
              <span>
                <Link href={`/blog/?q=%23${post.category}`}>
                  {post.category}
                </Link>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return renderList;
}

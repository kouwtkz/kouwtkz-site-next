// オリジナルタグを使用したい場合は定義元は必ずuse clientのものとなる
import getPosts from "@/app/actions/getPosts";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // const q = searchParams.q ? searchParams.q.toString() : undefined;
  // 投稿一覧取得
  const posts = await getPosts({max: 10});

  // 投稿がない場合
  if (posts.length === 0) {
    return <div className="text-center">投稿はありません</div>;
  }

  return (
    <div>
      <h2 className="text-4xl font-LuloClean text-center text-main pt-8 mb-12">
        MINI BLOG
      </h2>
      <div className="w-[80%] mx-auto">
        {posts.map((post, index) => {
          return (
            <div key={index} className="m-4">
              <h3 className="text-2xl text-main-dark font-bold inline-block m-4">
                <a href={`?postId=${post.postId}&extend`}>{post.title}</a>
              </h3>
              <span>
                <a href={`?q=%23${post.category}`}>{post.category}</a>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

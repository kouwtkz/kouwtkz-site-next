import { Post } from "@/app/blog/Post.d";
import MultiParser from "@/app/components/tag/MultiParser";
import Link from "next/link";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";
import { useServerState } from "../components/System/ServerState";
type Props = { post: Post };

export default function OnePost({ post }: Props) {
  const { isServerMode } = useServerState();
  const formattedDate = post.date ? post.date.toLocaleString("ja", opt) : "";
  return (
    <div className="mx-4 my-6">
      {post.pin !== 0 ? (
        post.pin > 0 ? (
          <div className="text-main-strong">▼ 固定された投稿</div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {post.title ? (
        <h3 className="text-2xl text-main-dark font-bold inline-block m-2">
          <Link
            href={{ pathname: "/blog", query: { postId: post.postId } }}
            prefetch={false}
          >
            {post.title}
          </Link>
        </h3>
      ) : (
        <></>
      )}
      {post.category ? (
        <div className="inline-block mx-1">
          {(typeof post.category === "string"
            ? [post.category]
            : post.category
          ).map((category, i) => (
            <div key={i} className="mx-1 underline inline-block">
              <Link
                href={{ pathname: "/blog", query: { q: `#${category}` } }}
                prefetch={false}
              >
                {category}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      <MultiParser className="blog">{post.body}</MultiParser>
      <div className="text-right [&>*]:ml-4">
        {post.draft ? (
          <span className="text-main-grayish">(下書き)</span>
        ) : post.date.getTime() > Date.now() ? (
          <span className="text-main-grayish">(予約)</span>
        ) : null}
        {isServerMode ? (
          <Link href={`/blog/post?target=${post.postId}`}>編集</Link>
        ) : null}
        {formattedDate ? (
          <Link
            className="text-main-grayish hover:text-main-grayish hover:opacity-70"
            href={{ pathname: "/blog", query: { postId: post.postId } }}
            prefetch={false}
          >
            {formattedDate}
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

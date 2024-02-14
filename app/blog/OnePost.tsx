import { Post } from "@/app/blog/Post.d";
import MultiParser from "@/app/components/tag/MultiParser";
import Link from "next/link";
import { BlogDateOptions as opt } from "@/app/components/System/DateTimeFormatOptions";
import { useServerState } from "../components/System/ServerState";
import { useCallback } from "react";
import { MakeURL } from "../components/functions/MakeURL";
import { backupStorageKey, useLocalDraftPost } from "./post/postLocalDraft";
type Props = { post: Post; fixedLabel?: string };

export default function OnePost({ post, fixedLabel }: Props) {
  const { isServerMode } = useServerState();
  const { removeLocalDraft } = useLocalDraftPost();
  const formattedDate = post.date ? post.date.toLocaleString("ja", opt) : "";
  const EditLink = useCallback(() => {
    if (!isServerMode) return <></>;
    const query: { [k: string]: string } = {};
    if (post.postId) query.target = post.postId;
    if (post.localDraft) query.draft = "";
    return <Link href={MakeURL({ pathname: "/blog/post", query })}>編集</Link>;
  }, [isServerMode, post.localDraft, post.postId]);
  return (
    <div className="mx-4 my-6">
      {typeof post.pin === "number" ? (
        post.pin > 0 ? (
          <div className="text-main-strong">
            {fixedLabel ||
              (post.localDraft ? "▼ 自動保存された下書き" : "▼ 固定された投稿")}
          </div>
        ) : null
      ) : null}
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
        {typeof post.date !== "undefined" ? (
          post.draft ? (
            <span className="text-main-grayish">(下書き)</span>
          ) : post.date.getTime() > Date.now() ? (
            <span className="text-main-grayish">(予約)</span>
          ) : null
        ) : null}
        {post.localDraft ? (
          <a
            href="#delete"
            onClick={(e) => {
              if (confirm("自動保存された下書きを削除しますか？")) {
                removeLocalDraft();
              }
              e.preventDefault();
            }}
          >
            削除
          </a>
        ) : null}
        <EditLink />
        <>
          {post.localDraft ? (
            <>
              <span className="text-main-grayish">
                {post.postId ? (
                  <>下書き（{post.postId}）</>
                ) : (
                  <>下書き（新規投稿）</>
                )}
              </span>
            </>
          ) : (
            <Link
              className="text-main-grayish hover:text-main-grayish hover:opacity-70"
              href={{ pathname: "/blog", query: { postId: post.postId } }}
              prefetch={false}
            >
              {formattedDate}
            </Link>
          )}
        </>
      </div>
    </div>
  );
}

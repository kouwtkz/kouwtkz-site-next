import { Post } from "@/app/blog/Post.d";
import MultiParser from "@/app/components/tag/MultiParser";
import Link from "next/link";
import { BlogDateOptions as opt } from "@/app/context/system/DateTimeFormatOptions";
import { useServerState } from "../context/system/ServerState";
import { useCallback, useMemo } from "react";
import { MakeURL } from "../components/functions/MakeURL";
import { backupStorageKey, useLocalDraftPost } from "./post/postLocalDraft";
import { HTMLAttributes } from "preact/compat";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
type Props = { post?: Post; detail?: boolean };

export default function OnePost({ post, detail = false }: Props) {
  const { isServerMode } = useServerState();
  const { removeLocalDraft } = useLocalDraftPost();
  const router = useRouter();
  useHotkeys("b", () => {
    if (detail) router.back();
  });

  const EditLink = useCallback(
    ({ children = "編集", className }: HTMLAttributes<HTMLElement>) => {
      if (!isServerMode) return <></>;
      const query: { [k: string]: string } = {};
      if (post?.postId) query.target = post.postId;
      if (post?.localDraft) query.draft = "";
      return (
        <Link
          className={className ? String(className) : undefined}
          href={MakeURL({ pathname: "/blog/post", query })}
        >
          <>{children}</>
        </Link>
      );
    },
    [isServerMode, post]
  );
  const formattedDate = useMemo(
    () => (post?.date ? post.date.toLocaleString("ja", opt) : ""),
    [post]
  );
  if (!post) return null;

  return (
    <div className="mx-4 my-6">
      {post.localDraft ? (
        <div>
          <EditLink>▼ 自動保存された下書き</EditLink>
        </div>
      ) : !detail && typeof post.pin === "number" ? (
        post.pin > 0 ? (
          <div className="text-main-strong">▼ 固定された投稿</div>
        ) : null
      ) : null}
      {post.title ? (
        <MultiParser only={{ toTwemoji: true }} className="inline-block">
          {detail ? (
            <h1 className="text-4xl text-main-deep font-bold mx-2 my-4 inline-block">
              {post.title}
            </h1>
          ) : (
            <h3 className="text-2xl text-main-dark font-bold inline-block m-2">
              {post.localDraft ? (
                post.title
              ) : (
                <Link
                  href={{ pathname: "/blog", query: { postId: post.postId } }}
                  prefetch={false}
                >
                  {post.title}
                </Link>
              )}
            </h3>
          )}
        </MultiParser>
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
      <MultiParser className="blog" detailsOpen={detail}>
        {post.body}
      </MultiParser>
      <div className="text-right [&>*]:ml-4">
        {typeof post.date !== "undefined" ? (
          post.draft ? (
            <span className="text-main-grayish">(下書き)</span>
          ) : post.date && post.date.getTime() > Date.now() ? (
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
          ) : detail ? (
            <>
              <span className="text-main-grayish">{formattedDate}</span>
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

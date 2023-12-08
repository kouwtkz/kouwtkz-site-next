"use client";

import { Post } from "@prisma/client";
import React from "react";
import posts from "./posts.mjs";
import { useHotkeys } from "react-hotkeys-hook";
import { FormTags } from "react-hotkeys-hook/dist/types";
import { useRouter } from "next/navigation";

const InputTags: FormTags[] = ["INPUT", "TEXTAREA", "SELECT"];

type PostFormProps = {
  categoryCount: {
    category: string;
    count: number;
  }[];
  postTarget?: Post | null;
};

const PostForm = ({ categoryCount, postTarget }: PostFormProps) => {
  const router = useRouter();

  const RunHotkeyEvent = (e: KeyboardEvent) => {
    const activeElement = (document.activeElement || document.body) as HTMLElement;
    switch (e.code) {
      case "Enter":
        PostSend();
        e.preventDefault();
        break;
      case "Period":
        if (e.ctrlKey) {
          // if (document.forms[0]) post_preview(document.forms[0]);
        }
        break;
      case "KeyN":
        document.getElementById("post_body_area")?.focus();
        e.preventDefault();
        break;
      case "Escape":
        activeElement.blur();
    }
  };

  const PostSend = () => {
    const form = (document.querySelector("form#postForm") ||
      null) as HTMLFormElement | null;
    if (form) {
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
      })
        .then((r) => r.json())
        .then((j) => {
          console.log(j)
          router.push(`/blog/post/${postTarget?.postId}`, { scroll: false })
        });
    }
  };

  useHotkeys("b", () => router.back());
  useHotkeys("n", RunHotkeyEvent);
  useHotkeys("ctrl+enter", RunHotkeyEvent, { enableOnFormTags: InputTags });
  useHotkeys("escape", RunHotkeyEvent, { enableOnFormTags: InputTags });
  return (
    <form
      method="POST"
      action="post/write"
      id="postForm"
      className="pt-2 [&>*]:my-2"
      onSubmit={(e) => {
        PostSend();
        e.preventDefault();
      }}
    >
      <h1 className="font-LuloClean text-3xl text-main my-6 pt-2 pb-8">
        Post form
      </h1>
      <input
        name="title"
        type="text"
        placeholder="タイトル"
        defaultValue={postTarget?.title}
        className="block mx-auto h-8 px-3 py-2 w-[80%] max-w-md"
      />
      <div className="mx-auto max-w-2xl flex justify-around">
        <label>
          <input
            title="ピン留め"
            name="pin"
            id="pinNumber"
            type="number"
            min="-128"
            max="127"
            placeholder="pin"
            defaultValue="0"
            className="w-12 text-center"
          />
          ピン
        </label>
        <select
          title="カテゴリ"
          name="category"
          data-before=""
          className="w-[30%]"
          // onChange="post_category(this)"
        >
          <option value="">カテゴリ</option>
          <option value="new">新規作成</option>
          {categoryCount.map((r, i) => (
            <option key={i} value={r.category}>
              {r.category} ({r.count})
            </option>
          ))}
        </select>
        <select
          title="操作"
          // onChange="post_operation(this)"
        >
          <option value="">操作</option>
          <option value="postid">ID名</option>
          <option value="duplication">複製</option>
          <option value="delete">削除</option>
        </select>
      </div>
      <div className="mx-auto max-w-2xl flex justify-around">
        <label>
          <input
            name="draft"
            type="checkbox"
            id="draftFlag"
            defaultChecked={Boolean(postTarget?.draft)}
          />
          下書き
        </label>
        <input
          type="datetime-local"
          name="date"
          placeholder="日付"
          title="日付"
          step={1}
          defaultValue={postTarget?.date.toISOString().replace(/:[^:]+$/, "")}
          className="p-1"
        />
        <select
          title="メディア"
          // onChange={() => {}}
        >
          <option value="">メディア</option>
          <option value="attached">添付</option>
          <option value="gallery">ギャラリー</option>
          <option value="link">リンク</option>
        </select>
      </div>
      <div className="mx-auto max-w-2xl flex justify-around">
        <input
          id="colorChanger"
          type="color"
          className="hidden"
          placeholder="色"
          title="色"
        />
        <select title="装飾">
          <option value="">装飾</option>
          <option value="color">色変え</option>
          <option value="bold">強調</option>
          <option value="strikethrough">打消し線</option>
          <option value="italic">イタリック体</option>
        </select>
        <select title="追加">
          <option value="">追加</option>
          <option value="br">改行</option>
          <option value="more">もっと読む</option>
          <option value="h2">見出し2</option>
          <option value="h3">見出し3</option>
          <option value="h4">見出し4</option>
          <option value="li">リスト</option>
          <option value="ol">数字リスト</option>
          <option value="code">コード</option>
        </select>
      </div>
      <textarea
        name="body"
        id="post_body_area"
        placeholder="今何してる？"
        defaultValue={postTarget?.body}
        className="block mx-auto w-[85%] max-w-2xl min-w-fit min-h-[12rem] p-2"
      />
      <div
        id="preview_area"
        className="hidden mx-auto w-[85%] max-w-2xl min-w-fit min-h-[12rem] p-2"
      />
      <input
        name="attached[]"
        type="file"
        accept="image/*"
        placeholder="画像選択"
        multiple
        className="hidden"
        // onChange={()=>{}}
      />
      <div className="[&>button]:mx-4 pt-2">
        <button type="button">プレビュー</button>
        <button type="submit">{postTarget ? "更新する" : "投稿する"}</button>
      </div>
    </form>
  );
};

export default PostForm;

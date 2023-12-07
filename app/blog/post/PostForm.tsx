"use client";

import { Post } from "@prisma/client";
import React from "react";

type PostFormProps = {
  categoryCount: {
    category: string;
    count: number;
  }[];
  postTarget?: Post | null
};

const PostForm = ({ categoryCount, postTarget }: PostFormProps) => {
  return (
    <form method="POST" action="post/write">
      <input
        name="title"
        type="text"
        placeholder="タイトル"
        defaultValue={postTarget?.title}
      />
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
        />
        ピン
      </label>
      <select
        title="カテゴリ"
        name="category"
        data-before=""
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
      <textarea
        name="body"
        id="post_body_area"
        placeholder="今何してる？"
        defaultValue={postTarget?.body}
      />
      <button type="button">プレビュー</button>
      <button type="submit">{postTarget ? "更新する" : "投稿する"}</button>
    </form>
  );
};

export default PostForm;

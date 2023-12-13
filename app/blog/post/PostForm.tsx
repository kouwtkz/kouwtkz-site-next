"use client";

import { Post } from "@prisma/client";
import React, { useEffect, useMemo, useRef } from "react";
import PostTextarea, { usePreviewMode } from "./PostTextarea";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import {
  setAttached,
  setCategory,
  setColorChange,
  setDecoration,
  setMedia,
  setOperation,
  setPostInsert,
} from "./PostFormFunctions";
import toast from "react-hot-toast";
import { HotkeyRunEvent } from "@/app/components/form/event/EventSet";

type PostFormProps = {
  categoryCount: {
    category: string;
    count: number;
  }[];
  postTarget?: Post | null;
  mode?: {
    duplication?: boolean;
  };
};

const PostForm = ({ categoryCount, postTarget, mode }: PostFormProps) => {
  const router = useRouter();
  const { togglePreviewMode } = usePreviewMode();
  const duplicationMode = mode?.duplication || false;
  const updateMode = postTarget && !duplicationMode;
  const formRef = useRef<HTMLFormElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const categoryNewRef = useRef<HTMLOptionElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const decorationRef = useRef<HTMLSelectElement>(null);
  const colorChangerRef = useRef<HTMLInputElement>(null);
  const colorChangeValueRef = useRef("");
  const InsertTextRef = useRef<HTMLSelectElement>(null);
  const selectMediaRef = useRef<HTMLSelectElement>(null);
  const AttachedRef = useRef<HTMLInputElement>(null);
  const postIdRef = useRef<HTMLInputElement>(null);
  const operationRef = useRef<HTMLSelectElement>(null);

  const beginFormDataRef = useRef<any>(null);
  useEffect(() => {
    if (!beginFormDataRef.current && formRef.current)
      beginFormDataRef.current = new FormData(formRef.current);
  }, []);

  const PostSend = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const beginData = beginFormDataRef.current as FormData;
    const deleteKeys: string[] = [];

    console.log(Object.fromEntries(formData));

    formData.forEach((item, key) => {
      const beginItem = beginData.get(key);
      switch (key) {
        case "postId":
        case "update":
          break;
        case "attached[]":
          if ((item as File).name === "") deleteKeys.push(key);
          break;
        default:
          if (item === beginItem) deleteKeys.push(key);
          break;
      }
    });

    deleteKeys.forEach((key) => formData.delete(key));

    fetch(formRef.current.action, {
      method: formRef.current.getAttribute("method") || formRef.current.method,
      body: formData,
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.postId) {
          router.push(`/blog/post/${j.postId}`);
        } else {
          router.push(`/blog`);
        }
        toast(updateMode ? "更新しました" : "投稿しました", { duration: 2000 });
        router.refresh();
      })
      .catch((err) => {
        console.log("送信に失敗しました", err);
      });
  };

  useHotkeys("b", () => router.back());

  HotkeyRunEvent({
    keys: "ctrl+enter",
    element: formRef.current,
    type: "submit",
    enableOnFormTags: true,
  });

  useHotkeys(
    "escape",
    (e) => {
      ((document.activeElement || document.body) as HTMLElement).blur();
      e.preventDefault();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "ctrl+period",
    () => {
      togglePreviewMode(textareaRef.current?.value);
    },
    { enableOnFormTags: ["TEXTAREA"] }
  );

  useHotkeys("n", (e) => {
    textareaRef.current?.focus();
    e.preventDefault();
  });

  return (
    <form
      method={"POST"}
      action="post/send"
      id="postForm"
      ref={formRef}
      encType="multipart/form-data"
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
        type="hidden"
        name="update"
        defaultValue={duplicationMode ? "" : postTarget?.postId}
      />
      <input
        type="hidden"
        name="postId"
        ref={postIdRef}
        defaultValue={postTarget?.postId}
      />
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
          className="w-[30%]"
          defaultValue={postTarget?.category || undefined}
          data-before={postTarget?.category || undefined}
          ref={categorySelectRef}
          onChange={() =>
            setCategory({
              selectCategory: categorySelectRef.current,
              newCategoryBase: categoryNewRef.current,
            })
          }
        >
          <option value="">カテゴリ</option>
          <option value="new" ref={categoryNewRef}>
            新規作成
          </option>
          {categoryCount.map((r, i) => (
            <option key={i} value={r.category}>
              {r.category} ({r.count})
            </option>
          ))}
        </select>
        <select
          title="操作"
          ref={operationRef}
          onChange={() =>
            setOperation({
              selectOperation: operationRef.current,
              postIdInput: postIdRef.current,
              router,
            })
          }
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
          className="px-1"
        />
      </div>
      <div className="mx-auto max-w-2xl flex justify-around">
        <select
          title="メディア"
          ref={selectMediaRef}
          onChange={() =>
            setMedia({
              selectMedia: selectMediaRef.current,
              inputAttached: AttachedRef.current,
              textarea: textareaRef.current,
            })
          }
        >
          <option value="">メディア</option>
          <option value="attached">添付</option>
          <option value="gallery">ギャラリー</option>
          <option value="link">リンク</option>
        </select>
        <input
          id="colorChanger"
          type="color"
          className="invisible absolute"
          placeholder="色"
          title="色"
          ref={colorChangerRef}
          onChange={() => {
            colorChangeValueRef.current = colorChangerRef.current?.value || "";
          }}
        />
        <select
          title="装飾"
          ref={decorationRef}
          onChange={() =>
            setDecoration({
              selectDecoration: decorationRef.current,
              textarea: textareaRef.current,
              colorChanger: colorChangerRef.current,
            })
          }
          onBlur={() => {
            if (colorChangeValueRef.current !== "") {
              setColorChange({
                colorChanger: colorChangerRef.current,
                textarea: textareaRef.current,
              });
            }
            colorChangeValueRef.current = "";
          }}
        >
          <option value="">装飾</option>
          <option value="color">色変え</option>
          <option value="bold">強調</option>
          <option value="strikethrough">打消し線</option>
          <option value="italic">イタリック体</option>
        </select>
        <select
          title="追加"
          ref={InsertTextRef}
          onChange={() =>
            setPostInsert({
              selectInsert: InsertTextRef.current,
              textarea: textareaRef.current,
            })
          }
        >
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
      <PostTextarea body={postTarget?.body} ref={textareaRef} />
      <input
        name="attached[]"
        type="file"
        accept="image/*"
        placeholder="画像選択"
        multiple
        style={{ display: "none" }}
        ref={AttachedRef}
        onChange={() =>
          setAttached({
            inputAttached: AttachedRef.current,
            textarea: textareaRef.current,
          })
        }
      />
      <div className="[&>button]:mx-4 pt-2">
        <button
          type="button"
          onClick={() =>
            togglePreviewMode(
              (
                document.querySelector(
                  "textarea#post_body_area"
                ) as HTMLTextAreaElement
              )?.value
            )
          }
        >
          プレビュー
        </button>
        <button type="submit">{updateMode ? "更新する" : "投稿する"}</button>
      </div>
    </form>
  );
};

export default PostForm;

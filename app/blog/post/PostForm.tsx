"use client";

import { Post } from "@prisma/client";
import React, {
  RefCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import * as z from "zod";
import {
  FieldValues,
  RefCallBack,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SetRegister from "@/app/components/form/hook/SetRegister";
import axios from "axios";

const schema = z.object({
  update: z.string(),
  postId: z.string(),
  title: z.string().nullish(),
  body: z.string().min(1, { message: "本文を入力してください" }),
  date: z.string().nullish(),
  category: z.string().nullish(),
  pin: z.number().nullish(),
  draft: z.boolean().nullish(),
  attached: z.custom<FileList>().nullish(),
});

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
  const [loading, setLoading] = useState(false);
  const { togglePreviewMode } = usePreviewMode();
  const duplicationMode = mode?.duplication || false;
  const updateMode = postTarget && !duplicationMode;
  const formRef = useRef<HTMLFormElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement | null>(null);
  const categoryNewRef = useRef<HTMLOptionElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const decorationRef = useRef<HTMLSelectElement>(null);
  const colorChangerRef = useRef<HTMLInputElement>(null);
  const colorChangeValueRef = useRef("");
  const InsertTextRef = useRef<HTMLSelectElement>(null);
  const selectMediaRef = useRef<HTMLSelectElement>(null);
  const AttachedRef = useRef<HTMLInputElement | null>(null);
  const postIdRef = useRef<HTMLInputElement | null>(null);
  const operationRef = useRef<HTMLSelectElement>(null);

  const defaultValues: { [k: string]: any } = {
    update: duplicationMode ? "" : postTarget?.postId,
    postId: postTarget?.postId,
    title: postTarget?.title,
    body: postTarget?.body,
    date: postTarget?.date.toISOString().replace(/:[^:]+$/, ""),
    category: postTarget?.category,
    pin: Number(postTarget?.pin || 0),
    draft: Boolean(postTarget?.draft),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(
        Object.entries(errors)
          .map(([key, err]) => `${key}: ${err?.message} [${err?.type}]`)
          .join("\n"),
        { duration: 2000 }
      );
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    const formData = new FormData();

    try {
      Object.entries(data).forEach(([key, item]) => {
        const defaultItem = defaultValues[key];
        switch (key) {
          case "postId":
          case "update":
            formData.append(key, item);
            break;
          case "attached":
            for (const _item of Array.from(item) as any[]) {
              formData.append(`${key}[]`, _item);
              if (_item.lastModified)
                formData.append(`${key}_mtime[]`, _item.lastModified);
            }
            break;
          default:
            if (item !== defaultItem && !(item === "" && !defaultItem))
              formData.append(key, item);
            break;
        }
      });
      if (Object.keys(Object.fromEntries(formData)).length > 0) {
        const res = await axios.post("post/send", formData);
        if (res.status === 200) {
          toast(updateMode ? "更新しました" : "投稿しました", {
            duration: 2000,
          });
          if (res.data.postId) {
            router.push(`/blog/post/${res.data.postId}`);
          } else {
            router.push(`/blog`);
          }
          router.refresh();
        }
      } else {
        toast.error("更新するデータがありませんでした", { duration: 2000 });
      }
    } catch (error) {
      toast.error("エラーが発生しました", { duration: 2000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-LuloClean text-3xl text-main my-6 pt-2 pb-8">
        Post form
      </h1>
      <input {...register("update")} type="hidden" />
      <input
        {...SetRegister({ name: "postId", ref: postIdRef, register })}
        type="hidden"
      />
      <input
        {...register("title")}
        type="text"
        placeholder="タイトル"
        disabled={loading}
        className="block mx-auto h-8 px-3 py-2 w-[80%] max-w-md"
      />
      <div className="mx-auto max-w-2xl flex justify-around">
        <label>
          <input
            {...register("pin")}
            title="ピン留め"
            id="pinNumber"
            type="number"
            min="-128"
            max="127"
            placeholder="pin"
            disabled={loading}
            className="w-12 text-center"
          />
          ピン
        </label>
        <select
          {...SetRegister({
            name: "category",
            ref: categorySelectRef,
            onChange: () =>
              setCategory({
                selectCategory: categorySelectRef.current,
                newCategoryBase: categoryNewRef.current,
              }),
            register,
          })}
          title="カテゴリ"
          className="w-[30%]"
          data-before={postTarget?.category || undefined}
          disabled={loading}
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
          disabled={loading}
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
          <input {...register("draft")} type="checkbox" disabled={loading} />
          下書き
        </label>
        <input
          {...register("date")}
          type="datetime-local"
          placeholder="日付"
          title="日付"
          step={1}
          className="px-1"
          disabled={loading}
        />
      </div>
      <div className="mx-auto max-w-2xl flex justify-around">
        <select
          title="メディア"
          ref={selectMediaRef}
          disabled={loading}
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
          disabled={loading}
          onChange={() => {
            colorChangeValueRef.current = colorChangerRef.current?.value || "";
          }}
        />
        <select
          title="装飾"
          ref={decorationRef}
          disabled={loading}
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
          disabled={loading}
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
      <PostTextarea
        registed={SetRegister({ name: "body", ref: textareaRef, register })}
        disabled={loading}
      />
      <input
        {...SetRegister({
          name: "attached",
          onChange: () =>
            setAttached({
              inputAttached: AttachedRef.current,
              textarea: textareaRef.current,
            }),
          ref: AttachedRef,
          register,
        })}
        type="file"
        accept="image/*"
        placeholder="画像選択"
        multiple
        style={{ display: "none" }}
        disabled={loading}
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

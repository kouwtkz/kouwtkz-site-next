"use client";

import { Post } from "@/app/blog/Post.d";
import React, {
  RefCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PostTextarea, { usePreviewMode } from "./PostTextarea";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter, useSearchParams } from "next/navigation";
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
import { usePostState } from "../PostState";
import { findMany } from "../functions/findMany";

const schema = z.object({
  update: z.string(),
  postId: z.string(),
  title: z.string().nullish(),
  body: z.string().min(1, { message: "本文を入力してください" }),
  date: z.string().nullish(),
  category: z.string().nullish(),
  pin: z.coerce.number().nullish(),
  draft: z.boolean().nullish(),
  attached: z.custom<FileList>().nullish(),
});

export default function PostForm() {
  const router = useRouter();
  const search = useSearchParams();
  const duplicationMode = Boolean(search.get("base"));
  const targetPostId = search.get("target") || search.get("base");
  const { posts, setPostsFromUrl } = usePostState();
  const postsUpdate = useRef(false);
  const doReset = useRef(postsUpdate.current);
  postsUpdate.current = posts.length > 0;
  const postTarget = targetPostId
    ? findMany({ list: posts, where: { postId: targetPostId }, take: 1 })[0]
    : null;
  const updateMode = postTarget && !duplicationMode;

  const categoryCount = posts.reduce((prev, cur) => {
    const category = cur.category;
    if (category) prev[category] = (prev[category] || 0) + 1;
    return prev;
  }, {} as { [K: string]: number });

  const [loading, setLoading] = useState(false);
  const { togglePreviewMode } = usePreviewMode();

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
    postId: duplicationMode ? undefined : postTarget?.postId,
    title: postTarget?.title,
    body: postTarget?.body,
    date: postTarget?.date
      .toLocaleString("sv-SE", { timeZone: "JST" })
      .replace(" ", "T"),
    category: postTarget?.category,
    pin: Number(postTarget?.pin || 0),
    draft: Boolean(postTarget?.draft),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onChangePostId = () => {
    const answer = prompt("記事のID名の変更", getValues("postId"));
    if (answer !== null) {
      setValue("postId", answer);
    }
  };
  const onDuplication = () => {
    if (confirm("記事を複製しますか？")) {
      router.replace(
        location.pathname + location.search.replace("target=", "base=")
      );
      router.refresh();
    }
  };
  const onDelete = () => {
    if (/target=/.test(location.search) && confirm("本当に削除しますか？")) {
      axios
        .delete("/blog/post/send", {
          data: JSON.stringify({ postId: getValues("postId") }),
        })
        .then((r) => {
          toast("削除しました", { duration: 2000 });
          setPostsFromUrl();
          router.push("/blog");
        });
    }
  };

  useEffect(() => {
    if (postsUpdate.current && !doReset.current) {
      doReset.current = true;
      reset(defaultValues);
    }
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
    let sendEnable = false;
    const append = (name: string, value: string | Blob, sendCheck = true) => {
      formData.append(name, value);
      if (sendCheck && !sendEnable) sendEnable = true;
    };

    try {
      Object.entries(data).forEach(([key, item]) => {
        const defaultItem = defaultValues[key];
        switch (key) {
          case "postId":
            append(key, item, item !== defaultItem);
            break;
          case "update":
            append(key, item, false);
            break;
          case "date":
            if (item !== defaultItem)
              append(key, item ? new Date(`${item}+09:00`).toISOString() : "");
            break;
          case "attached":
            for (const _item of Array.from(item) as any[]) {
              append(`${key}[]`, _item);
              if (_item.lastModified)
                append(`${key}_mtime[]`, _item.lastModified);
            }
            break;
          default:
            if (item !== defaultItem && !(item === "" && !defaultItem))
              append(key, item);
            break;
        }
      });
      if (sendEnable) {
        const res = await axios.post("post/send", formData);
        if (res.status === 200) {
          toast(updateMode ? "更新しました" : "投稿しました", {
            duration: 2000,
          });
          setPostsFromUrl();
          if (res.data.postId) {
            router.push(`/blog?postId=${res.data.postId}`);
          } else {
            router.push(`/blog`);
          }
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
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main my-6 pt-2 pb-8">
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
          {Object.entries(categoryCount).map(([category, count], i) => (
            <option key={i} value={category}>
              {category} ({count})
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
              onChangePostId,
              onDuplication,
              onDelete,
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
          className="bg-main"
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
        <button className="bg-main" type="submit">
          {updateMode ? "更新する" : "投稿する"}
        </button>
      </div>
    </form>
  );
}

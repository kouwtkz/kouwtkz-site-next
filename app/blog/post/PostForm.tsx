"use client";

import React, {
  RefCallback,
  useCallback,
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
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SetRegister from "@/app/components/form/hook/SetRegister";
import axios from "axios";
import { usePostState } from "../PostState";
import { findMany } from "../functions/findMany.mjs";
import ReactSelect from "react-select";
import { useMediaImageState } from "@/app/context/image/MediaImageState";
import {
  backupStorageKey,
  getLocalDraft,
  useLocalDraftPost,
} from "./postLocalDraft";

type labelValues = { label: string; value: string }[];

const schema = z.object({
  update: z.string(),
  postId: z.string(),
  title: z.string().nullish(),
  body: z.string().min(1, { message: "本文を入力してください" }),
  date: z.string().nullish(),
  pin: z.coerce.number().nullish(),
  draft: z.boolean().nullish(),
  attached: z.custom<FileList>().nullish(),
});

export default function PostForm() {
  const search = useSearchParams();
  const params = Object.fromEntries(search);
  const Content = useCallback(() => <Main params={{ ...params }} />, [params]);
  return <Content />;
}

function dateJISOfromLocaltime(item?: string) {
  return item ? new Date(`${item}+09:00`).toISOString() : "";
}
function dateJISOfromDate(date?: Date | null) {
  return (
    date?.toLocaleString("sv-SE", { timeZone: "JST" }).replace(" ", "T") || ""
  );
}

function Main({ params }: { params: { [k: string]: string | undefined } }) {
  const router = useRouter();
  const duplicationMode = Boolean(params.base);
  const targetPostId = params.target || params.base;
  const { posts, setPostsFromUrl, isSet } = usePostState();
  const { removeLocalDraft } = useLocalDraftPost();
  const postsUpdate = useRef(false);
  postsUpdate.current = posts.length > 0;
  const postTarget = targetPostId
    ? findMany({ list: posts, where: { postId: targetPostId }, take: 1 })[0]
    : null;
  const updateMode = postTarget && !duplicationMode;

  const categoryCount = useMemo(
    () =>
      posts.reduce((prev, cur) => {
        const categories = cur.category;
        categories?.forEach((category) => {
          if (category) prev[category] = (prev[category] || 0) + 1;
        });
        return prev;
      }, {} as { [K: string]: number }),
    [posts]
  );
  const getCategoryLabelValues = useCallback(() => {
    return Object.entries(categoryCount).map(([name, count]) => ({
      label: `${name} (${count})`,
      value: name,
    }));
  }, [categoryCount]);
  const [categoryList, setCategoryList] = useState<labelValues>(
    getCategoryLabelValues()
  );

  const postCategories = useMemo(
    () =>
      postTarget
        ? typeof postTarget.category === "string"
          ? [postTarget.category]
          : postTarget.category
        : [],
    [postTarget]
  );

  const { togglePreviewMode } = usePreviewMode();

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const decorationRef = useRef<HTMLSelectElement>(null);
  const colorChangerRef = useRef<HTMLInputElement>(null);
  const colorChangeValueRef = useRef("");
  const InsertTextRef = useRef<HTMLSelectElement>(null);
  const selectMediaRef = useRef<HTMLSelectElement>(null);
  const AttachedRef = useRef<HTMLInputElement | null>(null);
  const postIdRef = useRef<HTMLInputElement | null>(null);
  const operationRef = useRef<HTMLSelectElement>(null);

  const defaultValues = useMemo(
    () => ({
      update: duplicationMode ? "" : postTarget?.postId || "",
      postId: duplicationMode ? undefined : postTarget?.postId || "",
      title: postTarget?.title || "",
      body: postTarget?.body || "",
      category: postCategories,
      date: dateJISOfromDate(postTarget?.date),
      pin: Number(postTarget?.pin || 0),
      draft: Boolean(postTarget?.draft),
    }),
    [duplicationMode, postCategories, postTarget]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitted, isSubmitting },
    getValues,
    setValue,
    reset,
    control,
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if ("draft" in params) {
      const draft = getLocalDraft() || {};
      reset({ ...defaultValues, ...draft, date: dateJISOfromDate(draft.date) });
    } else {
      reset(defaultValues);
    }
  }, [reset, defaultValues, params]);

  const refIsSubmitted = useRef(false);
  useEffect(() => {
    return () => {
      if (isDirty && !isSubmitted && !refIsSubmitted.current) {
        const values = getValues();
        values.date = dateJISOfromLocaltime(values.date);
        localStorage.setItem(backupStorageKey, JSON.stringify(values));
      } else if (isSubmitted && refIsSubmitted.current) {
        removeLocalDraft();
      }
    };
  }, [isDirty, isSubmitted, getValues, removeLocalDraft]);

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
          router.replace("/blog");
        });
    }
  };

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
  const { setImageFromUrl } = useMediaImageState();

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

  const CategorySelect = useCallback(
    () => (
      <Controller
        name="category"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ReactSelect
            placeholder="カテゴリ"
            instanceId="blogTagSelect"
            className="flex-1"
            styles={{
              control: (provided) => ({
                ...provided,
                textAlign: "left",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 10,
              colors: {
                ...theme.colors,
                primary: "var(--main-color-deep)",
                primary25: "var(--main-color-pale)",
                primary50: "var(--main-color-soft)",
                primary75: "var(--main-color)",
              },
            })}
            isMulti
            options={categoryList}
            value={(field.value as string[]).map((fv) =>
              categoryList.find((ci) => ci.value === fv)
            )}
            onChange={(newValues) => {
              field.onChange(newValues.map((v) => v?.value));
            }}
            onBlur={field.onBlur}
          />
        )}
      />
    ),
    [categoryList, control]
  );

  const onSubmit: SubmitHandler<FieldValues> = useCallback(async () => {
    const formData = new FormData();
    let sendEnable = false;
    let attached = false;
    let data = getValues();
    const append = (name: string, value: string | Blob, sendCheck = true) => {
      formData.append(name, value);
      if (sendCheck && !sendEnable) sendEnable = true;
    };

    try {
      Object.entries(data).forEach(([key, item]) => {
        const defaultItem = (defaultValues as { [k: string]: any })[key];
        switch (key) {
          case "postId":
            append(key, item, item !== defaultItem);
            break;
          case "update":
            append(key, item, false);
            break;
          case "date":
            if (item !== defaultItem) append(key, dateJISOfromLocaltime(item));
            break;
          case "category":
            const value = item.join(",");
            if (postCategories?.join(",") !== value) append(key, value);
            break;
          case "attached":
            for (const _item of Array.from(item) as any[]) {
              append(`${key}[]`, _item);
              if (!attached) attached = true;
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
          if (attached) setImageFromUrl();
          refIsSubmitted.current = true;
          setTimeout(() => {
            if (res.data.postId) {
              router.replace(`/blog?postId=${res.data.postId}`);
            } else {
              router.replace(`/blog`);
            }
          }, 200);
        }
      } else {
        toast.error("更新するデータがありませんでした", { duration: 2000 });
      }
    } catch (error) {
      toast.error("エラーが発生しました", { duration: 2000 });
      console.error(error);
    }
  }, [
    defaultValues,
    getValues,
    postCategories,
    router,
    setImageFromUrl,
    setPostsFromUrl,
    updateMode,
  ]);

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
        className="block mx-auto text-lg h-9 px-3 py-2 w-[25rem] max-w-[80%]"
      />
      <div className="flex flex-row items-center min-w-[25rem] w-fit max-w-[80%] mx-auto">
        <CategorySelect />
        <button
          title="新規カテゴリ"
          type="button"
          className="ml-2 px-4 py-1 rounded-lg"
          onClick={() => {
            const answer = prompt("新規カテゴリーを入力してください");
            if (answer !== null) {
              const newCategory = { label: answer, value: answer };
              setCategoryList(categoryList.concat(newCategory));
              setValue("category", getValues("category").concat(answer));
            }
          }}
        >
          新規
        </button>
      </div>
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
            className="w-12 text-center"
          />
          ピン
        </label>
        <label>
          <input {...register("draft")} type="checkbox" />
          下書き
        </label>
        <input
          {...register("date")}
          type="datetime-local"
          placeholder="日付"
          title="日付"
          step={1}
          className="px-1"
        />
        <select
          title="操作"
          ref={operationRef}
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
      <PostTextarea
        registed={SetRegister({ name: "body", ref: textareaRef, register })}
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
      />
      <div className="pt-2">
        <button
          className="mx-4 px-4 py-2 rounded-lg"
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
        <button className="mx-4 px-4 py-2 rounded-lg" type="submit">
          {updateMode ? "更新する" : "投稿する"}
        </button>
      </div>
    </form>
  );
}

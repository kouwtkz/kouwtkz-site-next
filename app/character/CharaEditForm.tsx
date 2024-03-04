"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCharaState } from "./CharaState";
import { useCallback, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CharaType } from "./CharaType";
import { ImageMeeIcon } from "../components/tag/ImageMee";
import { MakeURL } from "../components/functions/MakeURL";
import axios from "axios";
import toast from "react-hot-toast";

export default function CharaEditForm() {
  const search = useSearchParams();
  const { charaObject, setIsSet } = useCharaState();
  const router = useRouter();
  const name = search.get("name");
  const chara = charaObject && name ? charaObject[name] : null;
  const getDefaultValues = useCallback(
    (chara: CharaType | null) => ({
      id: chara?.id || "",
      name: chara?.name || "",
      honorific: chara?.honorific || "",
      overview: chara?.overview || "",
      description: chara?.description || "",
    }),
    []
  );
  const schema = z.object({
    id: z
      .string()
      .min(1, { message: "IDは1文字以上必要です！" })
      .refine(
        (id) => {
          return !(charaObject && chara?.id !== id && id in charaObject);
        },
        { message: "既に使用しているIDです！" }
      ),
    name: z.string().min(1, { message: "名前は1文字以上必要です！" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { isDirty, defaultValues, errors, dirtyFields },
  } = useForm<FieldValues>({
    defaultValues: getDefaultValues(chara),
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    reset(getDefaultValues(chara));
  }, [chara, getDefaultValues, reset]);

  async function onSubmit() {
    const formValues = getValues();
    if (!charaObject) return;
    const formData = new FormData();
    if (chara?.id) formData.append("target", chara.id);
    Object.entries(formValues).forEach(([key, value]) => {
      switch (key) {
        default:
          if (key in dirtyFields) formData.append(key, value);
          break;
      }
    });
    const res = await axios.post("/character/send", formData);
    if (res.status === 200) {
      toast("更新しました", { duration: 2000 });
      setIsSet(false);
      setTimeout(() => {
        router.push(MakeURL({ query: { name: formValues.id } }).toString());
      }, 200);
    }
  }

  return (
    <form className="[&_input]:px-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="my-2">
        {chara?.media?.icon ? (
          <ImageMeeIcon
            imageItem={chara.media.icon}
            size={40}
            className="charaIcon text-4xl mr-2"
          />
        ) : null}
      </div>
      <div className="my-2">
        <input
          placeholder="キャラクターID"
          className="w-auto min-w-fit"
          {...register("id")}
        />
        {"id" in errors ? (
          <p className="text-red-400">{errors.id?.message?.toString()}</p>
        ) : null}
      </div>
      <div className="my-2">
        <input
          placeholder="名前"
          className="w-auto min-w-fit"
          {...register("name")}
        />
        <input placeholder="敬称" {...register("honorific")} />
        {"name" in errors ? (
          <p className="text-red-400">{errors.name?.message?.toString()}</p>
        ) : null}
      </div>
      <div className="my-2">
        <textarea
          placeholder="概要"
          className="px-2 py-1 min-w-fit w-[24rem]"
          {...register("overview")}
        />
      </div>
      <div className="my-2"></div>
      <div className="my-2">
        <textarea
          placeholder="詳細"
          className="px-2 py-1 min-w-fit w-[24rem] min-h-[8rem]"
          {...register("description")}
        />
      </div>
      <div className="my-2">
        <button
          className="px-4 py-2 rounded-lg"
          disabled={!isDirty}
          type="submit"
        >
          送信
        </button>
      </div>
    </form>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCharaState } from "./CharaState";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CharaType } from "./CharaType";
import { ImageMeeIcon } from "../components/tag/ImageMee";
import { MakeURL } from "../components/doc/MakeURL";
import axios from "axios";
import toast from "react-hot-toast";
import { useMediaImageState } from "../context/image/MediaImageState";
import ReactSelect from "react-select";
import { callReactSelectTheme } from "../components/theme/main";
import { useSoundState } from "../sound/SoundState";

export default function CharaEditForm() {
  const search = useSearchParams();
  const { charaObject, setIsSet } = useCharaState();
  const imageState = useMediaImageState();
  const soundState = useSoundState();
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
      defEmoji: chara?.defEmoji || "",
      icon: chara?.icon || "",
      image: chara?.image || "",
      headerImage: chara?.headerImage || "",
      playlist: chara?.playlist || [],
    }),
    []
  );
  const playlistOptions = useMemo(
    () =>
      [{ label: "デフォルト", value: "default" }].concat(
        soundState.SoundItemList.map((s) => ({
          label: s.title,
          value: s.src.slice(s.src.lastIndexOf("/") + 1),
        }))
      ),
    [soundState.SoundItemList]
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
      if (key in dirtyFields)
        switch (key) {
          case "playlist":
            const arr = value as string[];
            if (arr.length > 0) {
              arr.forEach((v) => {
                formData.append(`${key}[]`, v);
              });
            } else {
              formData.append(`${key}`, "");
            }
            break;
          default:
            formData.append(key, value);
            break;
        }
    });
    const res = await axios.post("/character/send", formData);
    toast(res.data.message, { duration: 2000 });
    if (res.status === 200) {
      if (res.data.update.chara) setIsSet(false);
      if (res.data.update.image) imageState.setImageFromUrl();
      setTimeout(() => {
        router.push(MakeURL({ query: { name: formValues.id } }).toString());
      }, 200);
    }
  }

  return (
    <form
      className="[&_input]:px-2 max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <div className="my-2 flex">
        <input
          placeholder="名前"
          className="w-auto min-w-fit"
          {...register("name")}
        />
        <input placeholder="敬称" {...register("honorific")} />
        <input
          className="w-16"
          placeholder="絵文字"
          {...register("defEmoji")}
        />
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
      <div className="my-2 [&>*]:my-1 flex flex-col">
        <label className="flex">
          <span className="mr-2">アイコン</span>
          <input
            className="flex-1"
            placeholder="自動設定"
            {...register("icon")}
          />
        </label>
        <label className="flex">
          <span className="mr-2">ヘッダー画像</span>
          <input
            className="flex-1"
            placeholder="ヘッダー画像"
            {...register("headerImage")}
          />
        </label>
        <label className="flex">
          <span className="mr-2">メイン画像</span>
          <input
            className="flex-1"
            placeholder="メイン画像"
            {...register("image")}
          />
        </label>
      </div>
      <div className="my-2">
        <Controller
          control={control}
          name="playlist"
          render={({ field }) => (
            <ReactSelect
              instanceId="CharaTagSelect"
              theme={callReactSelectTheme}
              isMulti
              options={playlistOptions}
              value={(field.value as string[]).map((fv) =>
                playlistOptions.find(({ value }) => value === fv)
              )}
              placeholder="プレイリスト"
              onChange={(newValues) => {
                field.onChange(newValues.map((v) => v?.value));
              }}
              onBlur={field.onBlur}
            ></ReactSelect>
          )}
        />
      </div>
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

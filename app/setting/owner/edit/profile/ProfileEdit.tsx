"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/blog/Post.d";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import AutoInput, {
  AutoInputItemType,
  MakeSchemaObject,
} from "@/app/components/form/input/AutoInput";
import { HotkeyRunEvent } from "@/app/components/form/event/EventSet";

const autoInputList: AutoInputItemType[] = [
  {
    label: "おなまえ",
    name: "name",
    type: "text",
    schema: z.string(),
  },
  {
    label: "プロフ",
    name: "description",
    type: "textarea",
    schema: z.string(),
  },
];
const schema = MakeSchemaObject(autoInputList);

type props = { currentUser?: User | null };

export default function ProfileEdit({ currentUser }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const defaultValues: { [k: string]: any } = {
    name: currentUser?.name || "",
    description: currentUser?.description || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const formRef = useRef<HTMLFormElement>(null);
  HotkeyRunEvent({
    keys: "ctrl+enter",
    element: formRef.current,
    type: "submit",
    enableOnFormTags: true,
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      Object.entries(data).forEach(([key, item]) => {
        switch (key) {
          default:
            if (item === defaultValues[key]) delete data[key];
            break;
        }
      });
      if (Object.keys(data).length > 0) {
        const res = await axios.post("profile/send", data);
        if (res.status === 200) {
          toast.success("プロフィールを変更しました！", { duration: 2000 });
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md m-auto"
      ref={formRef}
    >
      {autoInputList.map((item, i) => (
        <AutoInput
          item={item}
          register={register}
          disabled={loading}
          errors={errors}
          key={i}
        />
      ))}
      <div className="m-4">
        <button type="submit">プロフィール変更</button>
      </div>
    </form>
  );
}

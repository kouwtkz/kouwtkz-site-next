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
  MakeSchemaObject,
  AutoInputItemType,
} from "@/app/components/form/input/AutoInput";

const autoInputList: AutoInputItemType[] = [
  {
    label: "ユーザーID",
    name: "userId",
    type: "text",
    schema: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  },
  {
    label: "メールアドレス",
    name: "email",
    type: "email",
    schema: z
      .string()
      .email({ message: "メールアドレスの形式ではありません。" }),
  },
  {
    label: "パスワード",
    name: "password",
    type: "password",
    schema: z.string(),
  },
  {
    label: "パスワード（再）",
    name: "check_password",
    type: "password",
    schema: z.string(),
  },
];
const schema = MakeSchemaObject(autoInputList).superRefine(
  ({ password, check_password }, ctx) => {
    if (password || check_password) {
      if (password.length < 6) {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: "6文字以上入力する必要があります。",
        });
      }
      if (check_password.length === 0) {
        ctx.addIssue({
          path: ["check_password"],
          code: "custom",
          message: "パスワードをもう一度入力してください",
        });
      } else if (password !== check_password) {
        ctx.addIssue({
          path: ["check_password"],
          code: "custom",
          message: "パスワードが一致しません",
        });
      }
    }
  }
);

type props = { currentUser?: User | null };

export default function ProfileEdit({ currentUser }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const defaultValues: { [k: string]: any } = {
    userId: currentUser?.userId || "",
    email: currentUser?.email || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      Object.entries(data).forEach(([key, item]) => {
        switch (key) {
          case "check_password":
            delete data[key];
          case "password":
            if (!item) delete data[key];
            break;
          default:
            if (item === defaultValues[key]) delete data[key];
            break;
        }
      });
      if (Object.keys(data).length > 0) {
        const res = await axios.post("account/send", data);
        if (res.status === 200) {
          toast.success("アカウント設定を変更しました！", { duration: 2000 });
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md m-auto">
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

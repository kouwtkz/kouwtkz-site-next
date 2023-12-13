"use client";

import AutoInput, {
  AutoInputItemType,
  MakeSchemaObject,
} from "@/app/components/form/input/AutoInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

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
    schema: z.string().min(6, { message: "6文字以上入力する必要があります。" }),
  },
  {
    label: "パスワード（再）",
    id: "check_password",
    type: "password",
    schema: z
      .string()
      .min(1, { message: "パスワードをもう一度入力してください" }),
  },
];
const schema = MakeSchemaObject(autoInputList).superRefine(
  ({ password, check_password }, ctx) => {
    if (password !== check_password) {
      ctx.addIssue({
        path: ["check_password"],
        code: "custom",
        message: "パスワードが一致しません",
      });
    }
  }
);

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const defaultValues: { [k: string]: any } = {
    name: "",
    email: "",
    password: "",
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
      const res = await axios.post("signup/send", data);
      if (res.status === 200) {
        toast.success("登録に成功しました！");
        await signIn("credentials", {
          ...data,
          redirect: false,
        });
        router.push("/setting");
        router.refresh();
      }
    } catch (error) {
      toast("エラーが発生しました。");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 m-auto">
      <h1 className="font-LuloClean text-main m-2 mb-6 text-3xl">SIGN UP</h1>
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
          <button type="submit">新規作成</button>
        </div>
        <div className="m-4 underline">
          <Link href="/setting/login">ログイン</Link>
        </div>
      </form>
    </div>
  );
}

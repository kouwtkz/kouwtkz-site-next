"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formInputList = [
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
];
const schema = z.object(
  formInputList.reduce((a, c) => ({ ...a, ...{ [c.name]: c.schema } }), {})
);

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/signup", data);
      if (res.status === 200) {
        toast.success("登録に成功しました！");
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
        {formInputList.map((item, i) => (
          <div key={i}>
            <label className="m-4 flex justify-center items-center">
              <span className="flex-[1] text-right mr-2">{item.label}</span>
              <input
                className="flex-[1.6] px-2"
                {...register(item.name, { required: true })}
                name={item.name}
                type={item.type}
                disabled={loading}
              />
            </label>
            {errors[item.name] && (
              <div className="my-3 text-sm text-red-500">
                {String(errors[item.name]?.message)}
              </div>
            )}
          </div>
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

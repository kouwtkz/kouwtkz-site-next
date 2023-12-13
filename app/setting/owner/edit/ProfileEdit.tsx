"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formInputList = [
  {
    label: "おなまえ",
    name: "name",
    type: "text",
    schema: z.string(),
  },
];
const schema = z.object(
  formInputList.reduce((a, c) => ({ ...a, ...{ [c.name]: c.schema } }), {})
);

type props = { currentUser?: User | null };

export default function ProfileEdit({ currentUser }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("edit/send", data);
      if (res.status === 200) {
        toast.success("プロフィールを変更しました！");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md m-auto"
    >
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
        <button type="submit">プロフィール変更</button>
      </div>
    </form>
  );
}

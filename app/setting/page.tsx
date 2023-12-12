"use client";

import { signIn } from "next-auth/react";
import React, { useRef } from "react";

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div>
      <h1 className="font-LuloClean text-main">SETTING</h1>
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!formRef.current) return;
          const data = Object.fromEntries(new FormData(formRef.current));
          const res = await signIn("credentials", {
            ...data,
            redirect: false,
          });
          console.log(res);
        }}
      >
        <input name="userId" type="text" />
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}

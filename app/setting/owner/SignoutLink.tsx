"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignoutLink() {
  const router = useRouter();
  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        signOut({ redirect: false }).then(() => {
          router.push("/setting");
          router.refresh();
        })
      }}
      className="button text-2xl"
    >
      ログアウト
    </Link>
  );
}

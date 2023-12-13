import React from "react";
import SignupForm from "./SignupForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {process.env.NODE_ENV === "development" ? (
        <SignupForm />
      ) : (
        <div>
          <Link href="/">トップページへ戻る</Link>
        </div>
      )}
    </>
  );
}

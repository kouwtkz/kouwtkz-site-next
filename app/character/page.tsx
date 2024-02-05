import { Metadata } from "next";
import { Suspense } from "react";
import CharaObject from "./CharaObject";
const title = "Character".toUpperCase();
export const metadata: Metadata = { title };

export default function Page() {
  return (
    <Suspense>
      <CharaObject title={title} />
    </Suspense>
  );
}

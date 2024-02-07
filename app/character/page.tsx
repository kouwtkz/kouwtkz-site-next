import { Metadata } from "next";
import { Suspense } from "react";
import CharaPage from "./CharaPage";
const title = "Character".toUpperCase();
export const metadata: Metadata = { title };

export default function Page() {
  return (
    <Suspense>
      <CharaPage title={title} />
    </Suspense>
  );
}

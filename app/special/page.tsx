import Link from "next/link";

import { Metadata } from "next";
const title = "SPECIAL PAGE";
export const metadata: Metadata = { title };

export default function specialPage() {
  return (
    <div className="pt-8">
      <h1 className="font-LuloClean text-3xl sm:text-4xl text-main pt-8 mb-12">
        {title}
      </h1>
      <Link
        className="my-4 text-4xl text-center underline  "
        href="/special/fanart"
      >
        ファンアート
      </Link>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect } from "react";
import Twemoji from "react-twemoji";

export default function Page() {
  useEffect(() => {
    console.log("けいこくめぇめぇ");
  })
  return (
    <main>
      <Twemoji options={{ className: "emoji" }}>
        <div className="text-4xl [&>*]:m-4">
          <h1>はろはろめぇめぇ</h1>
          <div>
            <Link href="gallery">イラスト</Link>
          </div>
          <div>
            <Link href="character">キャラクター</Link>
          </div>
          <div>
            <Link href="blog">ブログ</Link>
          </div>
        </div>
      </Twemoji>
    </main>
  );
}

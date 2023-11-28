"use client";
import { useEffect } from "react";
import Twemoji from "react-twemoji";

export default function Page() {
  useEffect(() => {
    console.log("けいこくめぇめぇ");
  })
  return (
    <main>
      <Twemoji options={{ className: "emoji" }}>
        <div className="text-4xl">
          <h1>はろはろめぇめぇ</h1>
          <div>
            <a href="gallery">イラスト</a>
          </div>
          <div>
            <a href="blog">ブログ</a>
          </div>
        </div>
      </Twemoji>
    </main>
  );
}

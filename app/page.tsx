"use client";
import Twemoji from "react-twemoji";

export default function Home() {
  return (
    <main>
      <Twemoji options={{ className: "emoji" }}>
        <div className="text-4xl font-ZenMaru">
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

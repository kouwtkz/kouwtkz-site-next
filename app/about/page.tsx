export default function About() {
  return (
    <div>
      <h2 className="font-LuloClean text-3xl sm:text-4xl text-center text-main pt-8 mb-12">
        ABOUT
      </h2>
      <ul className="[&>li]:my-4 [&_h3]:text-main-deep [&_h3]:m-2">
        <li>
          <h3>さくしゃ</h3>
          <ul>
            <li>なまえ: わたかぜコウ</li>
            <li>すきなこと: おえかき</li>
          </ul>
        </li>
        <li>
          <h3>このサイト</h3>
          <ul>
            <li>フレームワーク: Next.js(SSG)</li>
            <li>サーバー: Cloudflare pages</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

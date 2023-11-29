import Link from "next/link";

const specialPage = () => (
  <div className="pt-8">
    <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">SPECIAL PAGE</h1>
    <Link className="my-4 text-4xl text-center underline  " href="/special/fanart">ファンアート</Link>
  </div>
);

export default specialPage

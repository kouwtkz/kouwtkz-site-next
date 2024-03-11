import { TopPageImage, TopPagePostList } from "@/app/TopPage";

export default async function Page() {
  return (
    <>
      <TopPageImage />
      {process.env.BLOG_ENABLE !== "false" ? <TopPagePostList /> : null}
    </>
  );
}

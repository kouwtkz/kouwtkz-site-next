import Rss from "rss";
import getPosts from "../functions/getPosts";
import { site } from "@/app/site/SiteData.mjs";
import { Post } from "../Post";

const SITE_URL = process.env.PRODUCTION_URL || "http://localhost";

export async function GET() {
  // const { posts } = await getPosts({ take: 30, common: true });
  const posts: Post[] = [];

  const feed = new Rss({
    title: site.title,
    description: site.description,
    feed_url: `${SITE_URL}/rss.xml`,
    site_url: SITE_URL,
    language: "ja",
    image_url: `${SITE_URL}${site.image}`
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.body,
      url: `${SITE_URL}/blog/${post.postId}`,
      guid: `${SITE_URL}/blog/${post.postId}`,
      date: post.date,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

import Rss from "rss";
import getPosts from "../functions/getPosts";
import { site } from "@/app/site/SiteData.mjs";
import { parse } from "marked";
import { getPostsFromJson } from "../posts.json/fromJson";
import twemoji from "twemoji";

const SITE_URL = process.env.PRODUCTION_URL || "http://localhost";

export async function GET() {
  const rawPosts = getPostsFromJson();
  const { posts } = getPosts({ posts: rawPosts, take: 30, common: true })

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
      description: twemoji.parse(parse(post.body)),
      url: `${SITE_URL}/blog?postId=${post.postId}`,
      guid: `${SITE_URL}/blog?postId=${post.postId}`,
      date: post.date,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

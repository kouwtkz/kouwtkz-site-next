// @ts-check

/** @typedef { import("../Post.d").Post } Post */
import Rss from "rss";
import getPosts from "./getPosts.mjs";
import { site } from "../../../app/context/site/SiteData.mjs";
import { parse } from "marked";
import { getPostsFromYaml } from "../posts.json/postDataFunction.mjs";
import twemoji from "twemoji";

const SITE_URL = site.url || "http://localhost";

/** @param {Post[]} rawPosts  */
export function GetPostsRssOption(rawPosts) {
  const { posts } = getPosts({ posts: rawPosts, take: 30, common: true })
  return posts;
}

export function MakeRss() {
  return GenerateRss(GetPostsRssOption(getPostsFromYaml()))
}

/** @param {Post[]} posts  */
export function GenerateRss(posts) {
  const feed = new Rss({
    title: site.title,
    description: site.description,
    feed_url: `${SITE_URL}/rss.xml`,
    site_url: SITE_URL + "/blog",
    language: "ja",
    image_url: `${SITE_URL}${site.image}`
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: twemoji.parse(parse(post.body.replace(/(\[[^\]]*\]\()(\/[^)]+\))/g, `$1${SITE_URL}$2`))),
      url: `${SITE_URL}/blog?postId=${post.postId}`,
      guid: `${SITE_URL}/blog?postId=${post.postId}`,
      date: post.date,
    });
  });
  return feed.xml()
}

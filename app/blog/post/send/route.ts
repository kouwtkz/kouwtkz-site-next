import { NextRequest, NextResponse } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
const isServerMode = !(isStatic && process.env.NODE_ENV === "production")
import { getPostsFromJson, setPostsToJson } from "../../posts.json/fromJson.mjs";
import { site } from "@/app/site/SiteData.mjs";
import { Post } from "../../Post";
import { uploadAttached } from "@/app/gallery/send/uploadAttached";

type PostFormType = {
  title?: string,
  body?: string,
  category?: string[],
  pin?: number,
  draft?: boolean,
  date?: Date,
  postId?: string,
  userId?: string
}

export async function GET() {
  return new Response("");
}

// 投稿または更新
export async function POST(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です", { status: 403 });

  const formData = await req.formData();
  let success = false

  success = success || await uploadAttached({
    attached: (formData.getAll("attached[]") || []) as File[],
    attached_mtime: formData.getAll("attached_mtime[]") || [],
    uploadDir: "images/blog/uploads"
  })

  const userId = site.author.account;

  const data = {} as PostFormType & Post;

  let postId = String(formData.get("postId"));
  const update = String(formData.get("update"));
  if (postId !== update) data.postId = postId;

  const title = formData.get("title");
  if (title !== null) data.title = String(title);

  const body = formData.get("body");
  if (body !== null || !update) data.body = String(body || "");

  const category = formData.get("category");
  if (category !== null) data.category = String(category).split(",");

  const pin = formData.get("pin");
  if (pin !== null) data.pin = Number(pin);

  const draft = formData.get("draft");
  if (draft !== null) data.draft = draft !== 'false';

  const date = formData.get("date");
  if (date !== null) {
    if (date === "") {
      data.date = new Date();
    } else {
      const stringDate = String(date);
      if (stringDate.endsWith("Z") || /\+/.test(stringDate))
        data.date = new Date(stringDate);
      else
        data.date = new Date(`${stringDate}+09:00`);
    }
  }

  // あとでJSON形式の書き出しにする
  if (!success) success = Object.keys(data).length > 0;
  if (success) {
    const posts = getPostsFromJson();
    if (update) {
      const updateData = posts.find((post) => post.postId === update);
      if (updateData) {
        Object.entries(data).forEach(([k, v]) => {
          (updateData as any)[k] = v;
        })
        updateData.updatedAt = new Date();
        setPostsToJson(posts);
      }
    } else {
      postId = postId || autoPostId();
      const maxId = Math.max(...posts.map(post => post.id));
      const now = new Date();
      posts.push({
        ...{
          id: maxId + 1, postId, userId, title: "", body: "", category: [], pin: 0, noindex: false, draft: false, date: now, updatedAt: now, flags: null, memo: null
        } as Post, ...data
      })
      setPostsToJson(posts);
    }

    return NextResponse.json({ postId });
  } else {
    return NextResponse.json({ error: "更新するデータがありません" }, { status: 500 });
  }
}

// 削除
export async function DELETE(req: NextRequest) {
  if (!isServerMode) return new Response("サーバーモード限定です");
  const data = await req.json();
  const postId = String(data.postId || "");
  if (postId) {
    const posts = getPostsFromJson();
    const deletedPosts = posts.filter(post => post.postId !== postId)
    if (posts.length !== deletedPosts.length) {
      setPostsToJson(deletedPosts);
    } else {
      return NextResponse.json({ result: "error", error: "削除済みです" }, { status: 500 });
    }
    return NextResponse.json({ result: "success", postId });
  } else {
    return NextResponse.json({ result: "error", error: "ID未指定です" }, { status: 500 });
  }
}

function autoPostId() {
  const now = new Date();
  const days = Math.floor((now.getTime() - new Date("2000-1-1").getTime()) / 86400000);
  const todayBegin = new Date(Math.floor(now.getTime() / 86400000) * 86400000);
  return days.toString(32) + ("0000" + (now.getTime() - todayBegin.getTime()).toString(30)).slice(-4)
}
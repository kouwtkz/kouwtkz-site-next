import { NextRequest, NextResponse } from "next/server";
import isStatic from "@/app/components/System/isStatic.mjs";
import fs from "fs";
import { getPostsFromJson, setPostsToJson } from "../../posts.json/fromJson";
import { site } from "@/app/site/SiteData.mjs";
import { Post } from "../../Post";
import path from "path";
import { MediaUpdate } from "@/mediaScripts/MediaUpdateModule";
const cwd = `${process.cwd()}/${process.env.ROOT || ""}`;

type PostFormType = {
  title?: string,
  body?: string,
  category?: string,
  pin?: number,
  draft?: boolean,
  date?: Date,
  postId?: string,
  userId?: string
}
export async function GET(req: NextRequest) {
  const header = Object.fromEntries(req.headers);
  return Response.json(isStatic ? {} : header);
}

// 投稿または更新
export async function POST(req: NextRequest) {
  if (isStatic && process.env.NODE_ENV === "production") return new Response("サーバーモード限定です");

  const formData = await req.formData();
  let success = false

  let attached = (formData.getAll("attached[]") || []) as File[];
  attached = attached.filter(file => Boolean(file.name));
  if (attached.length > 0) {
    if (!success) success = true;
    const attached_mtime = (formData.getAll("attached_mtime[]") || []) as any[];
    const now = new Date();
    const mediaDir = process.env.MEDIA_DIR || "_media";
    const dataDir = process.env.DATA_DIR || "";
    const publicDir = "public";
    const blogImageDir = `${mediaDir}/images/blog/uploads`;
    const blogImagesFullDir = path.resolve(`${cwd}/${dataDir}/${blogImageDir}`);
    const blogPublicImagesFullDir = path.resolve(`${cwd}/${publicDir}/${blogImageDir}`);
    try { fs.mkdirSync(blogImagesFullDir, { recursive: true }); } catch { }
    try { fs.mkdirSync(blogPublicImagesFullDir, { recursive: true }); } catch { }
    attached.forEach((file, i) => {
      file.arrayBuffer().then((abuf) => {
        const mTime = new Date(Number(attached_mtime[i]));
        const filename = file.name.replaceAll(" ", "_");
        const filePath = path.resolve(`${blogImagesFullDir}/${filename}`);
        console.log(filePath);
        fs.writeFileSync(filePath, Buffer.from(abuf));
        fs.utimesSync(filePath, now, new Date(mTime));
      })
    })
    await MediaUpdate();
  }
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
  if (category !== null) data.category = String(category);

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
          id: maxId + 1, postId, userId, title: "", body: "", category: "", pin: 0, noindex: false, draft: false, date: now, updatedAt: now, flags: null, memo: null
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
  if (process.env.NODE_ENV !== "development") return new Response("開発モード限定です");
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
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

type PostFormType = {
  title?: string,
  body?: string,
  category?: string,
  pin?: number,
  date?: Date,
  postId?: string,
  userId?: string
}
export async function GET(req: NextRequest) {
  const header = Object.fromEntries(req.headers);
  return Response.json(header);
}

// 投稿または更新
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "development" && req.headers.get("host") === "dev.local") {
    const formData = await req.formData();
    const attached = (formData.getAll("attached[]") || []) as File[];
    attached.forEach((file) => {
      console.log(file);
    })

    const data = {} as PostFormType;

    let postId = String(formData.get("postId"));
    const update = String(formData.get("update"));

    const title = formData.get("title");
    if (!update || title) data.title = String(title);

    const body = formData.get("body");
    if (!update || body) data.body = String(body);

    const category = formData.get("category");
    if (category) data.category = String(category);

    const pin = formData.get("pin");
    if (pin) data.pin = Number(pin);

    const date = formData.get("date");
    if (date) data.date = new Date(String(date));

    if (Object.keys(data).length > 0) {
      if (update) {
        await prisma.post.updateMany({ where: { postId: { equals: postId } }, data })
      } else {
        data.userId = "root";
        postId = postId || autoPostId();
        data.postId = postId;
        await prisma.post.create({ data: (data as any) })
      }
    }

    console.log(postId);
    return NextResponse.json({ postId });
  } else {
    return NextResponse.json({ error: "許可されてません" }, { status: 500 });
  }
}

// 削除
export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === "development" && req.headers.get("host") === "dev.local") {
    const data = await req.json();
    return NextResponse.json(["DELETE", data]);
  } else {
    return NextResponse.json({ error: "許可されてません" }, { status: 500 });
  }
}

export function autoPostId() {
  const now = new Date();
  const days = Math.floor((now.getTime() - new Date("2000-1-1").getTime()) / 86400000);
  const todayBegin = new Date(Math.floor(now.getTime() / 86400000) * 86400000);
  return days.toString(32) + ("0000" + (now.getTime() - todayBegin.getTime()).toString(30)).slice(-4)
}
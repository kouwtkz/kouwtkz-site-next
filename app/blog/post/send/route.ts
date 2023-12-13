import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import isStatic from "@/app/components/System/isStatic.mjs";
import getCurrentUser from "@/app/actions/getCurrentUser";

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
  return Response.json(isStatic ? {} : header);
}

// 投稿または更新
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "development" && req.headers.get("host") === "dev.local") {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "ログインしてません" }, { status: 500 });
    const formData = await req.formData();
    const attached = (formData.getAll("attached[]") || []) as File[];
    attached.forEach((file) => {
      console.log(file);
    })
    const userId = currentUser.userId;

    const data = {} as PostFormType;

    let postId = String(formData.get("postId"));
    const update = String(formData.get("update"));

    const title = formData.get("title");
    if (title) data.title = String(title);

    const body = formData.get("body");
    if (!update) data.body = String(body || "");

    const category = formData.get("category");
    if (category) data.category = String(category);

    const pin = formData.get("pin");
    if (pin) data.pin = Number(pin);

    const date = formData.get("date");
    if (date) data.date = new Date(String(date));

    if (Object.keys(data).length > 0) {
      if (update) {
        await prisma.post.updateMany({
          where: {
            AND: [{ postId }, { userId }]
          },
          data
        })
      } else {
        postId = postId || autoPostId();
        data.postId = postId;
        data.userId = userId;
        await prisma.post.create({ data: (data as any) })
      }
    }

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

function autoPostId() {
  const now = new Date();
  const days = Math.floor((now.getTime() - new Date("2000-1-1").getTime()) / 86400000);
  const todayBegin = new Date(Math.floor(now.getTime() / 86400000) * 86400000);
  return days.toString(32) + ("0000" + (now.getTime() - todayBegin.getTime()).toString(30)).slice(-4)
}
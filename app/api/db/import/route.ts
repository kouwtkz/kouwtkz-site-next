import { NextRequest, NextResponse } from "next/server"
import fs from "fs";
import prisma from "@/app/lib/prisma";
import { Post, User, UserRemember } from "@prisma/client";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    const table = String(request.nextUrl.searchParams.get('table')).toLocaleLowerCase();
    const jsonDir = `${process.env.PWD}/_data/db/json/${table}.json`;
    const doneRecord = [] as any[];
    let done = fs.existsSync(jsonDir);
    if (done) {
      const readData = String(fs.readFileSync(jsonDir));
      const jsonData = JSON.parse(readData);
      switch (table) {
        case "post":
          const posts = jsonData as Post[];
          for (const post of posts) {
            const checkPost = await prisma.post.findFirst({ where: { postId: { equals: post.postId } }, select: { postId: true } });
            if (!checkPost) {
              const response = await prisma.post.create({ data: post });
              doneRecord.push(response);
            }
          }
          break;
        case "user":
          const users = jsonData as User[];
          for (const user of users) {
            const checkUser = await prisma.user.findFirst({ where: { userId: user.userId }, select: { userId: true } });
            if (!checkUser) {
              const response = await prisma.user.create({ data: user });
              doneRecord.push(response);
            }
          }
          break;
        default:
          done = false;
          break;
      }
    }
    return NextResponse.json({
      result:
        done ? (doneRecord.length > 0 ?
          `${doneRecord.length}件インポートしました！` : "インポートしたデータはありませんでした")
          : "たぶんパスを間違えてます、インポートできませんでした"
    });
  } else {
    return NextResponse.json({ result: "なんかエラーになりました" })
  }
}

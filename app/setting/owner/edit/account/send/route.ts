import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/app/lib/prisma"
import getCurrentUser from "@/app/actions/getCurrentUser";

// サインアップのためのポスト関数を作成
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "ログインしてません" }, { status: 500 });

    const body = await request.json();
    const data: { [k: string]: any } = {};

    // パスワードのハッシュ化
    if (body.password) {
      data.hashedPassword = await bcrypt.hash(String(body.password), 12)
    }
    if (body.email) data.email = String(body.email);
    if (body.userId) data.userId = String(body.userId);

    if (Object.keys(data).length > 0) {
      const response = await prisma.user.updateMany({
        where: {
          userId: currentUser.userId
        },
        data
      })
      // レスポンスの格納
      return NextResponse.json(response)
    } else {
      return NextResponse.json({ error: "更新するデータがありません" }, { status: 500 });
    }
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}

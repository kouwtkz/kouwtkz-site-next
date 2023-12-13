import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import getCurrentUser from "@/app/actions/getCurrentUser";

// サインアップのためのポスト関数を作成
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "ログインしてません" }, { status: 500 });

    const body = await request.json();

    const { name } = body
    const data = { name };

    const response = await prisma.user.updateMany({
      where: {
        userId: currentUser.userId
      },
      data
    })

    // レスポンスの格納
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}

import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/app/lib/prisma"

// サインアップのためのポスト関数を作成
export async function POST(request: Request) {
  try {
    // リクエストボディの取得
    const body = await request.json()
    const { email, userId, password } = body

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // ユーザーの作成はprisma.user.createを使用する
    const response = await prisma.user.create({
      data: {
        email,
        userId,
        hashedPassword
      }
    })

    // レスポンスの格納
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return new NextResponse("Error", { status: 500 })
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOption";
import prisma from '@/app/lib/prisma'

// ログインユーザー取得
const getCurrentUser = async () => {
  try {
    // セッション情報取得
    const session = await getServerSession(authOptions)
    // ログインしてない場合（メールアドレスがない場合）nullを返す
    if (!session?.user?.email) {
      return null
    }
    // ログインユーザー取得（データベースで何も戻ってこなければnullを返す）
    const response = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!response) {
      return null
    }

    // 最終的にユーザー情報を出力
    return response
  } catch (error) {
    return null
  }
}

export default getCurrentUser
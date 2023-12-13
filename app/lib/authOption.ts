import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'

// NextAuth設定
export const authOptions: NextAuthOptions = {
  // Prismaを使うための設定
  adapter: PrismaAdapter(prisma),

  // セッションの設定
  providers: [
    // メールアドレス認証
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // メールアドレスとパスワード
        id_email: { label: 'id_email', type: 'text' },
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        // メールアドレスとパスワードがない場合はエラー
        if (!(credentials?.id_email || credentials?.email) || !credentials?.password) {
          throw new Error('メールアドレスとパスワードが存在しません')
        }

        // ユーザーを取得
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.email }, { userId: credentials.id_email }]
          }
        })

        // ユーザーが存在しない場合はエラー
        if (!user || !user?.hashedPassword) {
          throw new Error('ユーザーが存在しません')
        }

        // パスワードが一致しない場合はエラー
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!isCorrectPassword) {
          throw new Error('パスワードが一致しません')
        }

        // 全ての処理が通ったらユーザー情報を返す
        return user
      }
    })
  ],
  // セッションの保存方法（二択っぽい）
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET
}
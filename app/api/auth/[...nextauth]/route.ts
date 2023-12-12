import NextAuth from "next-auth"
// authOptionsは分離した方がビルドエラーが起こらないようなので分離
import { authOptions } from "@/app/lib/authOption"

// NextAuthを使用してハンドラの作成？
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

'use client'
// 認証チェックするためのコンテキスト

// NextAuthのreactの方にセッションプロバイダーがある
import { SessionProvider } from 'next-auth/react'

type AuthContextProps = {
  children: React.ReactNode
}

// 認証コンテキスト関数はセッションプロバイダーでラップ
const AuthContext = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

// AuthContextはそのままセッションプロバイダーとして返す
export default AuthContext;

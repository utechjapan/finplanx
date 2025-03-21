// lib/auth-demo.ts
// デモユーザー用の認証プロバイダ（開発環境・デモ環境用）
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// デモユーザー情報
const demoUsers = [
  {
    id: "demo-user-1",
    name: "デモユーザー",
    email: "demo@example.com",
    password: "password123",
  },
  {
    id: "admin-user",
    name: "管理者ユーザー",
    email: "admin@example.com",
    password: "admin123",
  },
];

export const demoAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "デモログイン",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // デモユーザーの認証
        const user = demoUsers.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password
        );

        if (!user) {
          // デモモードでは、どんな認証情報でもデモユーザーとしてログイン可能
          if (process.env.DEMO_MODE === "1") {
            return {
              id: "demo-user-1",
              name: "デモユーザー",
              email: credentials.email,
            };
          }
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
  debug: process.env.NODE_ENV === "development",
};
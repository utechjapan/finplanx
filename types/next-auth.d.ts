// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// JWT トークンにユーザーIDを含めるための拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLoginNotificationEmail,
  sendEmailVerificationEmail
} from "@/lib/email";
import crypto from "crypto";
import { Adapter } from "next-auth/adapters";

// Determine if running in development/demo mode
export const isDevMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV !== "production";
};

// Mock user for demo mode
const DEMO_USER = {
  id: "demo-user-id",
  name: "Demo User",
  email: "demo@example.com",
  emailVerified: new Date(),
};

// Create a custom adapter that falls back to in‑memory storage if Prisma fails
const createFallbackAdapter = (): Adapter => {
  try {
    // Try to use Prisma adapter if database is available
    return PrismaAdapter(prisma);
  } catch (error) {
    console.warn("Failed to initialize Prisma adapter, using fallback memory adapter", error);
    
    // In-memory adapter as fallback that implements the Adapter interface
    const users = new Map<string, any>();
    // Add demo user
    users.set(DEMO_USER.id, DEMO_USER);
    
    return {
      createUser: async (data) => {
        const id = crypto.randomUUID();
        const user = { id, ...data, emailVerified: null, createdAt: new Date() };
        users.set(id, user);
        return user;
      },
      getUser: async (id: string) => users.get(id) || null,
      getUserByEmail: async (email: string) => {
        if (email === DEMO_USER.email) return DEMO_USER;
        const found = Array.from(users.values()).find((user: any) => user.email === email);
        return found || null;
      },
      getUserByAccount: async ({ providerAccountId, provider }) => {
        // In demo mode, if providerAccountId equals "demo", return the demo user
        if (isDevMode() && providerAccountId === "demo") return DEMO_USER;
        return null;
      },
      updateUser: async (data) => {
        const user = users.get(data.id);
        if (!user) throw new Error("User not found");
        const updatedUser = { ...user, ...data };
        users.set(data.id, updatedUser);
        return updatedUser;
      },
      deleteUser: async (userId) => {
        const user = users.get(userId);
        if (!user) throw new Error("User not found");
        users.delete(userId);
        return user;
      },
      linkAccount: async (data) => data,
      unlinkAccount: async ({ providerAccountId, provider }) => { /* no-op */ },
      createSession: async (data) => data,
      getSessionAndUser: async (sessionToken: string) => {
        if (isDevMode()) {
          return {
            user: DEMO_USER,
            session: {
              sessionToken,
              userId: DEMO_USER.id,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
          };
        }
        return null;
      },
      updateSession: async (data) => data,
      deleteSession: async () => { /* no-op */ },
      createVerificationToken: async (data) => data,
      useVerificationToken: async () => null,
    } as Adapter;
  }
};

export const authOptions: NextAuthOptions = {
  adapter: createFallbackAdapter(),

  providers: [
    // Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Special case for demo login
        if (isDevMode() && credentials.email === "demo@example.com") {
          return DEMO_USER;
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          }).catch(err => {
            console.error("Error fetching user:", err);
            return null;
          });
          
          if (!user || !user.password) return null;
          
          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) return null;

          try {
            await sendLoginNotificationEmail(user.email!, user.name || "Unknown User");
          } catch (emailError) {
            console.error("Failed to send login notification email:", emailError);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          if (isDevMode()) {
            console.log("Running in dev mode, allowing demo user login");
            return DEMO_USER;
          }
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    verifyRequest: "/verify-request",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        if (account) token.provider = account.provider;
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
    async signIn({ user, account, profile }) {
      return true;
    },
  },

  debug: process.env.NODE_ENV === "development",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
};

// Helper function for user registration
export async function registerUser(name: string, email: string, password: string) {
  try {
    if (isDevMode()) {
      return { 
        success: true, 
        user: {
          id: "demo-user-id",
          name,
          email,
          createdAt: new Date(),
        },
        message: "デモモード: アカウントが作成されました。" 
      };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (existingUser) {
      return { success: false, error: "このメールアドレスは既に登録されています" };
    }
    
    const hashedPassword = await hash(password, 12);
    const verificationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    }).catch(err => {
      console.error("Error creating user:", err);
      throw err;
    });

    try {
      await sendEmailVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      message: "アカウントが作成されました。メールアドレスの確認を行ってください。",
    };
  } catch (error) {
    console.error("User registration error:", error);
    if (isDevMode()) {
      return { 
        success: true, 
        user: {
          id: "demo-user-id",
          name,
          email,
          createdAt: new Date(),
        },
        message: "デモモード: アカウントが作成されました。" 
      };
    }
    return { success: false, error: "ユーザー登録中にエラーが発生しました" };
  }
}

// Generate email verification token (for resending verification emails)
export async function generateEmailVerificationTokenForResend(email: string) {
  if (isDevMode()) {
    return { success: true, token: "demo-verification-" + Date.now() };
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "ユーザーが見つかりません" };
    }
    if (user.emailVerified) {
      return { success: true, message: "メールアドレスは既に確認済みです" };
    }
    const token = crypto.randomUUID();
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken: token } });
    await sendEmailVerificationEmail(email, user.name || "Unknown", token);
    return { success: true, message: "確認メールを送信しました" };
  } catch (error) {
    console.error("Email verification token generation error:", error);
    return { success: false, error: "確認メールの生成中にエラーが発生しました" };
  }
}

// Verify email with token
export async function verifyEmail(token: string) {
  if (isDevMode()) {
    return { success: true, message: "メールアドレスが確認されました" };
  }
  try {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      return { success: false, error: "無効または期限切れのトークンです" };
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verificationToken: null },
    });
    return { success: true, message: "メールアドレスが正常に確認されました" };
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "メールアドレスの確認中にエラーが発生しました" };
  }
}

// Helper function for password reset
export async function generatePasswordResetToken(email: string) {
  if (isDevMode()) {
    return { success: true, token: "demo-token-" + Date.now() };
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, message: "パスワードリセットリンクを送信しました（メールアドレスが登録されている場合）" };
    }
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: { token, expiresAt },
      create: { userId: user.id, token, expiresAt },
    });
    await sendPasswordResetEmail(email, user.name || "Unknown", token);
    return { success: true, message: "パスワードリセットリンクを送信しました" };
  } catch (error) {
    console.error("Password reset token generation error:", error);
    return { success: false, error: "パスワードリセットリンクの生成中にエラーが発生しました" };
  }
}

// Helper function to reset password with token
export async function resetPassword(token: string, newPassword: string) {
  if (isDevMode()) {
    return { success: true, message: "パスワードがリセットされました" };
  }
  try {
    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!resetRecord) {
      return { success: false, error: "無効または期限切れのトークンです" };
    }
    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });
    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });
    return { success: true, message: "パスワードが正常にリセットされました" };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "パスワードのリセット中にエラーが発生しました" };
  }
}

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

// Function to determine if running in development/demo mode
export const isDevMode = () => {
  return process.env.NODE_ENV !== "production" || process.env.DEMO_MODE === "1";
};

// Demo users for development and demo environments (not used in production)
export const demoUsers = [
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

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter in production mode
  ...(isDevMode() ? {} : { adapter: PrismaAdapter(prisma) }),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // In dev/demo mode, use demo users
          if (isDevMode()) {
            console.log("Demo mode authentication attempt:", credentials.email);

            // First check if it's one of our demo users
            const demoUser = demoUsers.find(
              (user) =>
                user.email === credentials.email &&
                user.password === credentials.password
            );

            if (demoUser) {
              console.log("Demo user authenticated:", demoUser.email);
              return {
                id: demoUser.id,
                name: demoUser.name,
                email: demoUser.email,
              };
            }

            // Demo mode feature: In demo mode, allow any credentials to log in as demo user
            if (process.env.DEMO_MODE === "1") {
              console.log("Creating demo session for user:", credentials.email);
              return {
                id: "demo-user-1",
                name: "デモユーザー",
                email: "demo@example.com",
              };
            }

            return null;
          }

          // Production mode - check database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) {
            return null;
          }

          // Send login notification email (in production)
          if (!isDevMode()) {
            try {
              // Cast email as non-null and provide fallback for name
              await sendLoginNotificationEmail(user.email!, user.name || "Unknown User");
            } catch (emailError) {
              console.error("Failed to send login notification email:", emailError);
              // Don't block login if email fails
            }
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
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
        if (account) {
          token.provider = account.provider;
        }
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
      if (isDevMode() && account && (account.provider === "google" || account.provider === "github")) {
        return true;
      }
      if (account && account.provider === "google") {
        return true;
      }
      if (account && account.provider === "github") {
        return true;
      }
      return true;
    },
  },

  debug: process.env.NODE_ENV === "development",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
};

// Helper function for user registration
export async function registerUser(name: string, email: string, password: string) {
  if (isDevMode()) {
    console.log("Demo mode: Simulating successful user registration for", email);
    const existingDemoUser = demoUsers.find((user) => user.email === email);
    if (existingDemoUser) {
      return { success: false, error: "このメールアドレスは既に登録されています" };
    }
    return {
      success: true,
      user: {
        id: "demo-" + Date.now(),
        name,
        email,
      },
      message: "アカウントが作成されました。メールアドレスの確認を行ってください。",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
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
        createdAt: user.createdAt, // Now available from the schema
      },
      message: "アカウントが作成されました。メールアドレスの確認を行ってください。",
    };
  } catch (error) {
    console.error("User registration error:", error);
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

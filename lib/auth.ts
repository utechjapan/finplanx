// lib/auth.ts - Improved authentication system
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

// Properly detect if we're in demo mode based on env var only
export const isDevMode = () => {
  // Check if NEXT_PUBLIC_DEMO_MODE is explicitly set to 'true'
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // Demo mode special case
          if (isDevMode() && credentials.email === 'demo@example.com' && credentials.password === 'password123') {
            return {
              id: 'demo-user',
              name: 'デモユーザー',
              email: 'demo@example.com',
              emailVerified: new Date(),
            };
          }
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          if (!user || !user.password) return null;
          
          // Password comparison
          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) return null;

          // Only send login notification in production
          if (process.env.NODE_ENV === 'production' && !isDevMode()) {
            try {
              await sendLoginNotificationEmail(user.email!, user.name || "Unknown User");
            } catch (emailError) {
              console.error("Failed to send login notification email:", emailError);
              // Allow login even if email fails
            }
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    // OAuth providers - only configure if credentials are provided
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : []),
  ],

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    verifyRequest: "/verify-email",
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
      // OAuth sign-ins always allowed
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true;
      }
      
      // For credentials provider
      if (account?.provider === 'credentials') {
        // Demo mode always allowed
        if (isDevMode()) {
          return true;
        }
        
        // In production, email verification is required
        if (process.env.NODE_ENV === 'production') {
          return user.emailVerified != null;
        }
        
        return true;
      }
      
      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-please-change-in-production",
  
  debug: process.env.NODE_ENV === "development",
};

// User registration helper function
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check for existing user
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
      // Skip email verification in demo mode
      if (!isDevMode()) {
        await sendEmailVerificationEmail(email, name, verificationToken);
      } else {
        // In demo mode, auto-verify email
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        });
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Registration succeeds even if email fails
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
    return { success: false, error: "ユーザー登録中にエラーが発生しました" };
  }
}

// Email verification token regeneration
export async function generateEmailVerificationTokenForResend(email: string) {
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
    
    try {
      await sendEmailVerificationEmail(email, user.name || "Unknown", token);
      return { success: true, message: "確認メールを送信しました" };
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return { success: false, error: "確認メールの送信中にエラーが発生しました" };
    }
  } catch (error) {
    console.error("Email verification token generation error:", error);
    return { success: false, error: "確認メールの生成中にエラーが発生しました" };
  }
}

// Email verification function
export async function verifyEmail(token: string) {
  try {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      return { success: false, error: "無効または期限切れのトークンです" };
    }
    
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), verificationToken: null },
      });
      
      // Send welcome email after verification
      try {
        await sendWelcomeEmail(user.email!, user.name || "User");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
      
      return { success: true, message: "メールアドレスが正常に確認されました" };
    } catch (dbError) {
      console.error("Database error during email verification:", dbError);
      return { success: false, error: "データベース更新中にエラーが発生しました" };
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "メールアドレスの確認中にエラーが発生しました" };
  }
}

// Password reset token generation
export async function generatePasswordResetToken(email: string) {
  try {
    // For security, return success even if user not found
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Password reset requested for non-existent user: ${email}`);
      return { success: true, message: "パスワードリセットリンクを送信しました（メールアドレスが登録されている場合）" };
    }
    
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    try {
      // Update or create token
      await prisma.passwordReset.upsert({
        where: { userId: user.id },
        update: { token, expiresAt },
        create: { userId: user.id, token, expiresAt },
      });
      
      // Skip email in demo mode
      if (!isDevMode()) {
        await sendPasswordResetEmail(email, user.name || "Unknown", token);
      }
      
      return { success: true, message: "パスワードリセットリンクを送信しました" };
    } catch (dbError) {
      console.error("Database error during password reset:", dbError);
      return { success: false, error: "データベース更新中にエラーが発生しました" };
    }
  } catch (error) {
    console.error("Password reset token generation error:", error);
    return { success: false, error: "パスワードリセットリンクの生成中にエラーが発生しました" };
  }
}

// Password reset function
export async function resetPassword(token: string, newPassword: string) {
  try {
    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    
    if (!resetRecord) {
      return { success: false, error: "無効または期限切れのトークンです" };
    }
    
    try {
      const hashedPassword = await hash(newPassword, 12);
      
      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });
      
      await prisma.passwordReset.delete({ where: { id: resetRecord.id } });
      
      return { success: true, message: "パスワードが正常にリセットされました" };
    } catch (dbError) {
      console.error("Database error during password reset:", dbError);
      return { success: false, error: "パスワードのリセット中にエラーが発生しました" };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "パスワードのリセット中にエラーが発生しました" };
  }
}
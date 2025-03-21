// File: lib/auth.ts
// Updates to the authentication system to improve reliability and security

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

// Determine if running in development mode or demo mode
export const isDevMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV !== "production";
};

// Create a robust fallback adapter that works without a database
const createFallbackAdapter = () => {
  // Try to use the PrismaAdapter by default for production use
  try {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Skip database connection in demo mode
      throw new Error("Running in demo mode - using memory adapter");
    }
    return PrismaAdapter(prisma);
  } catch (error) {
    console.warn("Using fallback memory adapter:", error instanceof Error ? error.message : String(error));
    
    // Mock user for demo mode with all required properties
    const DEMO_USER = {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@example.com",
      emailVerified: new Date(),
      createdAt: new Date(),
    };
    
    // In-memory adapter fallback with proper User structure
    const users = new Map();
    const accounts = new Map();
    const sessions = new Map();
    const verificationTokens = new Map();
    
    // Add demo user
    users.set(DEMO_USER.id, DEMO_USER);
    
    return {
      createUser: async (data) => {
        const id = crypto.randomUUID();
        const user = { 
          id, 
          ...data, 
          emailVerified: data.emailVerified || null, 
          createdAt: new Date() 
        };
        users.set(id, user);
        return user;
      },
      getUser: async (id) => users.get(id) || null,
      getUserByEmail: async (email) => {
        for (const user of users.values()) {
          if (user.email === email) {
            return { ...user, emailVerified: user.emailVerified || null };
          }
        }
        return null;
      },
      getUserByAccount: async ({ providerAccountId, provider }) => {
        // Find account
        let userId = null;
        for (const account of accounts.values()) {
          if (account.providerAccountId === providerAccountId && account.provider === provider) {
            userId = account.userId;
            break;
          }
        }
        if (!userId) return null;
        
        // Return user with required properties
        const user = users.get(userId);
        if (!user) return null;
        
        return {
          id: user.id,
          name: user.name || null,
          email: user.email || null,
          emailVerified: user.emailVerified || null,
          image: user.image || null
        };
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
      linkAccount: async (data) => {
        const id = crypto.randomUUID();
        const account = { id, ...data };
        accounts.set(id, account);
        return account;
      },
      unlinkAccount: async ({ providerAccountId, provider }) => {
        for (const [id, account] of accounts.entries()) {
          if (account.providerAccountId === providerAccountId && account.provider === provider) {
            accounts.delete(id);
            return account;
          }
        }
      },
      createSession: async (data) => {
        const id = crypto.randomUUID();
        const session = { id, ...data };
        sessions.set(id, session);
        return session;
      },
      getSessionAndUser: async (sessionToken) => {
        let session = null;
        for (const s of sessions.values()) {
          if (s.sessionToken === sessionToken) {
            session = s;
            break;
          }
        }
        if (!session) return null;
        const user = users.get(session.userId);
        if (!user) return null;
        return { 
          session, 
          user: { 
            ...user, 
            emailVerified: user.emailVerified || null 
          } 
        };
      },
      updateSession: async (data) => {
        let session = null;
        let sessionId = null;
        for (const [id, s] of sessions.entries()) {
          if (s.sessionToken === data.sessionToken) {
            session = s;
            sessionId = id;
            break;
          }
        }
        if (!session) return null;
        const updatedSession = { ...session, ...data };
        sessions.set(sessionId, updatedSession);
        return updatedSession;
      },
      deleteSession: async (sessionToken) => {
        for (const [id, session] of sessions.entries()) {
          if (session.sessionToken === sessionToken) {
            sessions.delete(id);
            return session;
          }
        }
      },
      createVerificationToken: async (data) => {
        const key = data.identifier + data.token;
        verificationTokens.set(key, data);
        return data;
      },
      useVerificationToken: async ({ identifier, token }) => {
        const key = identifier + token;
        const verificationToken = verificationTokens.get(key);
        if (!verificationToken) return null;
        verificationTokens.delete(key);
        return verificationToken;
      },
    };
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
          return {
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@example.com",
            emailVerified: new Date(),
          };
        }
        
        try {
          // In demo mode, always return a successful response for preset credentials
          if (isDevMode()) {
            if (credentials.email === "user@example.com" && credentials.password === "password123") {
              return {
                id: "user-1",
                name: "Test User",
                email: "user@example.com",
                emailVerified: new Date(),
              };
            }
          }

          // Production code - try the database
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
            // Only send email notifications in production mode
            if (!isDevMode()) {
              await sendLoginNotificationEmail(user.email!, user.name || "Unknown User");
            }
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
      // Ensure email verification for credential sign-ins
      if (account?.provider === 'credentials') {
        // Allow unverified emails in dev/demo mode
        if (isDevMode()) {
          return true;
        }
        
        // In production, ensure email is verified
        return user.emailVerified != null;
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
  try {
    // In demo mode, simulate successful registration
    if (isDevMode()) {
      return { 
        success: true, 
        user: {
          id: "demo-" + Date.now(),
          name,
          email,
          createdAt: new Date(),
        },
        message: "ユーザーが正常に登録されました",
      };
    }

    // Check for existing user
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
      // Don't fail registration if email fails - but log the error
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

// Generate email verification token (for resending verification emails)
export async function generateEmailVerificationTokenForResend(email: string) {
  try {
    // In demo mode, simulate success
    if (isDevMode()) {
      return { success: true, message: "確認メールを送信しました" };
    }

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
  try {
    // In demo mode, simulate success
    if (isDevMode()) {
      return { success: true, message: "メールアドレスが正常に確認されました" };
    }

    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      return { success: false, error: "無効または期限切れのトークンです" };
    }
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
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "メールアドレスの確認中にエラーが発生しました" };
  }
}

// Helper function for password reset
export async function generatePasswordResetToken(email: string) {
  try {
    // In demo mode, simulate success
    if (isDevMode()) {
      return { success: true, message: "パスワードリセットリンクを送信しました" };
    }

    // For security, always return success even if user not found
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, message: "パスワードリセットリンクを送信しました（メールアドレスが登録されている場合）" };
    }
    
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
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
  try {
    // In demo mode, simulate success
    if (isDevMode()) {
      return { success: true, message: "パスワードが正常にリセットされました" };
    }

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

// Helper function to validate a password reset token
export async function validatePasswordResetToken(token: string) {
  try {
    // In demo mode, always valid
    if (isDevMode()) {
      return { valid: true, email: "demo@example.com" };
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    
    if (!resetRecord || !resetRecord.user.email) {
      return { valid: false };
    }
    
    return { valid: true, email: resetRecord.user.email };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false };
  }
}
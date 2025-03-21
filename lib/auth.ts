// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcrypt";

// Function to determine if running in development/demo mode
const isDevMode = () => {
  return process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === "1";
};

// Demo users for development environment
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

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database session storage when not in demo mode
  ...(isDevMode() ? {} : { adapter: PrismaAdapter(prisma) }),
  
  providers: [
    // Add OAuth providers if configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      })
    ] : []),
    
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      })
    ] : []),
    
    // Credentials provider for email/password login
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
            const user = demoUsers.find(
              (user) => 
                user.email === credentials.email && 
                user.password === credentials.password
            );
            
            if (user) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
              };
            }
            
            // Demo mode feature: Any email/password combination works
            if (process.env.DEMO_MODE === "1") {
              return {
                id: "demo-user-1",
                name: credentials.email.split('@')[0],
                email: credentials.email,
              };
            }
            
            return null;
          }
          
          // Production mode - check database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          if (!user) {
            return null;
          }
          
          const passwordMatch = await compare(
            credentials.password,
            user.password
          );
          
          if (!passwordMatch) {
            return null;
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
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        
        // Store provider info if using OAuth
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
  },
  
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
  debug: process.env.NODE_ENV === "development",
};

// Helper function for user registration
export async function registerUser(name: string, email: string, password: string) {
  // In demo mode, just return success
  if (isDevMode()) {
    return {
      success: true,
      user: {
        id: "demo-" + Date.now(),
        name,
        email,
        createdAt: new Date(),
      }
    };
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return { 
        success: false, 
        error: "このメールアドレスは既に登録されています" 
      };
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    };
  } catch (error) {
    console.error("User registration error:", error);
    return { 
      success: false, 
      error: "ユーザー登録中にエラーが発生しました" 
    };
  }
}
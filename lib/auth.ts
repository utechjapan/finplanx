// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcrypt";

// Function to determine if running in development/demo mode
export const isDevMode = () => {
  return process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === "1";
};

// Demo users for development and demo environments
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
  // Use Prisma adapter for database session storage when not in demo mode
  ...(isDevMode() ? {} : { adapter: PrismaAdapter(prisma) }),

  providers: [
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
            console.log('Demo mode authentication attempt:', credentials.email);
            
            // First check if it's one of our demo users
            const demoUser = demoUsers.find(
              (user) => 
                user.email === credentials.email && 
                user.password === credentials.password
            );
            
            if (demoUser) {
              console.log('Demo user authenticated:', demoUser.email);
              return {
                id: demoUser.id,
                name: demoUser.name,
                email: demoUser.email,
              };
            }
            
            // Demo mode feature: In demo mode, allow any credentials to log in as demo user
            if (process.env.DEMO_MODE === "1") {
              console.log('Creating demo session for user:', credentials.email);
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

    // Add Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Add GitHub provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
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

    // Add additional callback to handle sign-in from OAuth providers in dev mode
    async signIn({ user, account, profile }) {
      // In dev mode, always succeed OAuth sign-ins
      if (isDevMode() && account && (account.provider === 'google' || account.provider === 'github')) {
        return true;
      }

      // For production environments, handle the OAuth providers
      if (account && account.provider === "google") {
        // Custom logic for Google sign-in if needed
        return true;
      }

      if (account && account.provider === "github") {
        // Custom logic for GitHub sign-in if needed
        return true;
      }

      return true;
    }
  },
  
  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Set the session strategy to JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Use a consistent secret across environments
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",
};

// Helper function for user registration
export async function registerUser(name: string, email: string, password: string) {
  // In demo mode, just return success without database operations
  if (isDevMode()) {
    console.log('Demo mode: Simulating successful user registration for', email);
    
    // Check if trying to register an existing demo user
    const existingDemoUser = demoUsers.find(user => user.email === email);
    if (existingDemoUser) {
      return { 
        success: false, 
        error: "このメールアドレスは既に登録されています" 
      };
    }
    
    // In demo mode, always succeed with a new demo user
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
// app/api/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDevMode } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Main status object
  const status = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    demo_mode: isDevMode(),
    services: {
      database: {
        status: "unknown",
        message: ""
      },
      auth: {
        status: "ok",
        message: "Auth configuration available"
      },
      email: {
        status: isDevMode() ? "skipped" : "unknown",
        message: isDevMode() ? "Email is skipped in demo mode" : ""
      }
    },
    config: {
      nextauth_url: process.env.NEXTAUTH_URL ? "set" : "missing",
      database_url: process.env.DATABASE_URL ? "set" : "missing",
      nextauth_secret: process.env.NEXTAUTH_SECRET ? "set" : "missing",
      email_config: process.env.EMAIL_SERVER_HOST ? "set" : "missing"
    }
  };
  
  // Check database connection if not in demo mode
  if (!isDevMode()) {
    try {
      // Simple query to test database connection
      await prisma.$queryRaw`SELECT 1+1 AS result`;
      status.services.database = {
        status: "ok",
        message: "Connected successfully"
      };
    } catch (error) {
      console.error("Database health check failed:", error);
      status.status = "degraded";
      status.services.database = {
        status: "error",
        message: "Failed to connect to database"
      };
    }
    
    // Check email configuration
    if (
      process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_PORT &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD
    ) {
      status.services.email = {
        status: "ok",
        message: "Email configuration available"
      };
    } else {
      status.services.email = {
        status: "warning",
        message: "Email configuration incomplete"
      };
    }
  }
  
  // For security, hide sensitive information
  const sanitizedStatus = {
    ...status,
    config: {
      ...status.config,
      nextauth_url: status.config.nextauth_url === "set" ? 
        (process.env.NEXTAUTH_URL ? 
          process.env.NEXTAUTH_URL.replace(/^(https?:\/\/[^\/]+).*$/, '$1') : "set") 
        : "missing"
    }
  };
  
  // Return a 200 response even if components are degraded
  // The status field will indicate the overall system status
  return NextResponse.json(sanitizedStatus);
}
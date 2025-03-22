// app/providers.tsx (Fixed with enhanced error handling)
'use client';

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { NotificationProvider } from "@/src/components/providers/NotificationProvider";
import { AuthProviderWrapper } from "@/src/components/providers/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Error boundary for session provider issues
  const [sessionError, setSessionError] = React.useState<Error | null>(null);

  if (sessionError) {
    console.error("Session provider error:", sessionError);
    // Simple fallback UI for session errors
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            There was a problem initializing the authentication system. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="finplanx-theme">
        <AuthProviderWrapper>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProviderWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
}
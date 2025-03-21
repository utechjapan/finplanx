// app/providers.tsx (update)
'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { NotificationProvider } from "@/src/components/providers/NotificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="finplanx-theme">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
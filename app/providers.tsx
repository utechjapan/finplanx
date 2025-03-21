// app/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="finplanx-theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
// src/components/providers/AuthProvider.tsx - Fixed
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

// Define the Auth context type
interface AuthContextType {
  login: (email: string, password: string, callbackUrl?: string) => Promise<{success: boolean, error?: string}>;
  logout: (callbackUrl?: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<{success: boolean, error?: string}>;
  resetPassword: (email: string) => Promise<{success: boolean, error?: string}>;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if logged in based on session status
  const isLoggedIn = status === 'authenticated';

  // Function to handle login
  const login = async (email: string, password: string, callbackUrl = '/dashboard') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Handle success
      if (result?.ok && result.url) {
        window.location.href = callbackUrl;
        return { success: true };
      }
      
      return { success: !!result?.ok };
    } catch (err) {
      const errorMessage = 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = async (callbackUrl = '/') => {
    try {
      setLoading(true);
      await signOut({ callbackUrl });
      return;
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle registration
  const registerUser = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return { success: false, error: data.error || 'Registration failed' };
      }
      
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = 'An error occurred during registration';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password reset
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Password reset failed');
        return { success: false, error: data.error || 'Password reset failed' };
      }
      
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = 'An error occurred during password reset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user navigates
  useEffect(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        registerUser,
        resetPassword,
        loading,
        error,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Main Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderWrapper>{children}</AuthProviderWrapper>
    </SessionProvider>
  );
}
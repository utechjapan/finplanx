'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Only run this code on the client side
  useEffect(() => {
    setMounted(true);
    
    // Check for system preference first
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Use system preference
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  // Function to apply theme
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Don't render until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="w-10 h-10"></div>; // Placeholder with same dimensions
  }

  return (
    <Button
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-800" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </Button>
  );
}
// src/components/ui/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for system preference first
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Use system preference if available
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

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
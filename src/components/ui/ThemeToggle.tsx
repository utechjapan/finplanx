// src/components/ui/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get stored theme or default to light mode for better readability
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Default to light mode for better readability
      setTheme('light');
      document.documentElement.classList.toggle('dark', false);
      localStorage.setItem('theme', 'light');
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
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
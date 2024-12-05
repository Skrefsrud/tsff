'use client';

import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Ensure the component is mounted before rendering to avoid hydration errors
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="text-secondary"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle Theme"
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}

'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/20 hover:bg-black/35 text-white/90 hover:text-white transition-all border border-white/20 shadow-sm backdrop-blur-sm"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
}

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../web/contexts/ThemeContext';

export function ThemeToggle(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl glass-morphism hover:shadow-lg transition-all duration-300 hover:scale-105 group hover-lift interactive-scale overflow-hidden"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {theme === 'dark' ? (
        <Sun className="relative z-10 w-5 h-5 text-amber-500 transition-all duration-300 group-hover:rotate-45 group-hover:text-amber-400 group-hover:scale-110" />
      ) : (
        <Moon className="relative z-10 w-5 h-5 text-indigo-600 transition-all duration-300 group-hover:-rotate-12 group-hover:text-indigo-500 group-hover:scale-110" />
      )}
    </button>
  );
}

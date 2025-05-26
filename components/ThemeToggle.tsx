import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gray-200 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
} 
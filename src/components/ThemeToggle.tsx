import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cn';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative h-9 w-9 rounded-lg flex items-center justify-center',
        'bg-surface-2 border border-border',
        'hover:bg-surface-3 hover:border-border-hover',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
      )}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun 
        className={cn(
          'h-4 w-4 absolute transition-all duration-200',
          theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        )} 
      />
      <Moon 
        className={cn(
          'h-4 w-4 absolute transition-all duration-200',
          theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-90 scale-0'
        )} 
      />
    </button>
  );
}


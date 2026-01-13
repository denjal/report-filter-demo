import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'default' && 'bg-surface-3 text-text-primary hover:bg-surface-4',
          variant === 'ghost' && 'text-text-secondary hover:text-text-primary hover:bg-surface-3',
          variant === 'outline' && 'border border-border bg-transparent text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-surface-2',
          variant === 'danger' && 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
          // Sizes
          size === 'sm' && 'h-7 px-2.5 text-xs',
          size === 'md' && 'h-8 px-3 text-sm',
          size === 'lg' && 'h-10 px-4 text-sm',
          size === 'icon' && 'h-8 w-8',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';


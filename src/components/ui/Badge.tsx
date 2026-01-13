import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'status' | 'priority';
  color?: string;
}

export function Badge({ 
  className, 
  variant = 'default', 
  color,
  style,
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-surface-3 text-text-secondary',
        variant === 'outline' && 'border border-border text-text-secondary',
        variant === 'status' && 'bg-surface-3 text-text-secondary',
        variant === 'priority' && 'bg-surface-3 text-text-secondary',
        className
      )}
      style={{
        ...style,
        ...(color && { 
          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          color: color,
        }),
      }}
      {...props}
    />
  );
}


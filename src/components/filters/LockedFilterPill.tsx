import { Lock } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { FilterType } from '../../types/filters';
import { filterTypeConfig } from '../../types/filters';

interface LockedFilterPillProps {
  tag: FilterType;
  valueLabel: string;
  className?: string;
}

export function LockedFilterPill({ tag, valueLabel, className }: LockedFilterPillProps) {
  const config = filterTypeConfig[tag];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-surface-3/50 border border-border/50 text-sm h-7 px-2.5',
        'cursor-not-allowed select-none',
        className
      )}
      title="Required by your access level"
    >
      <Lock className="h-3 w-3 text-text-tertiary" />
      <span className="text-text-tertiary font-medium">
        {config.label}:
      </span>
      <span className="text-text-secondary">
        {valueLabel}
      </span>
    </div>
  );
}


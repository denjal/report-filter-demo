import { Lock, Tag } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { FilterType } from '../../types/filters';
import { filterTypeConfig } from '../../types/filters';
import { useCustomTags } from '../../hooks/useCustomTags';

interface LockedFilterPillProps {
  tag: FilterType;
  valueLabel: string;
  tagKey?: string; // For custom_tag type
  className?: string;
}

export function LockedFilterPill({ tag, valueLabel, tagKey, className }: LockedFilterPillProps) {
  const { getTagByKey } = useCustomTags();
  
  // Get the label for the filter type
  let filterLabel: string;
  let isCustomTag = false;
  
  if (tag === 'custom_tag' && tagKey) {
    const customTag = getTagByKey(tagKey);
    filterLabel = customTag?.label || tagKey;
    isCustomTag = true;
  } else {
    const config = filterTypeConfig[tag];
    filterLabel = config.label;
  }

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
      <span className="text-text-tertiary font-medium flex items-center gap-1">
        {isCustomTag && <Tag className="h-3 w-3" />}
        {filterLabel}:
      </span>
      <span className="text-text-secondary">
        {valueLabel}
      </span>
    </div>
  );
}

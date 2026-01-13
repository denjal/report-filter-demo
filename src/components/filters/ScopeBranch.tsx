import { Plus, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { LockedFilterPill } from './LockedFilterPill';
import { FilterPill } from './FilterPill';
import { ScopedFilterDropdown } from './ScopedFilterDropdown';
import type { Filter, FilterType, FilterOperator } from '../../types/filters';
import type { PermissionScope } from '../../types/permissions';

interface ScopeBranchProps {
  scope: PermissionScope;
  filters: Filter[];
  onAddFilter: (type: FilterType, operator: FilterOperator, value: Filter['value'], tagKey?: string) => void;
  onUpdateFilter: (filterId: string, updates: Partial<Omit<Filter, 'id'>>) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearFilters: () => void;
  onManageTags: () => void;
}

export function ScopeBranch({
  scope,
  filters,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onClearFilters,
  onManageTags,
}: ScopeBranchProps) {
  const hasUserFilters = filters.length > 0;

  // Get tags that are already used (locked or in user filters) so we don't duplicate
  // Note: custom_tag filters can be used multiple times with different tagKeys
  const usedTags = new Set<FilterType>([
    ...scope.requiredFilters.map(f => f.tag),
    ...filters.filter(f => f.type !== 'custom_tag').map(f => f.type),
  ]);

  return (
    <div className="rounded-lg border border-border bg-surface-1/50 p-3">
      {/* Filter chain */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Locked/Required filters */}
        {scope.requiredFilters.map((rf, idx) => (
          <div key={`locked-${idx}`} className="flex items-center gap-2">
            <LockedFilterPill
              tag={rf.tag}
              valueLabel={rf.label}
              tagKey={rf.tagKey}
            />
            {(idx < scope.requiredFilters.length - 1 || hasUserFilters || true) && (
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
            )}
          </div>
        ))}

        {/* User-added filters */}
        {filters.map((filter, idx) => (
          <div key={filter.id} className="flex items-center gap-2">
            <FilterPill
              filter={filter}
              onUpdate={(updates) => onUpdateFilter(filter.id, updates)}
              onRemove={() => onRemoveFilter(filter.id)}
              scopeId={scope.id}
            />
            {idx < filters.length - 1 && (
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
            )}
          </div>
        ))}

        {/* Add filter button */}
        <ScopedFilterDropdown
          scope={scope}
          usedTags={usedTags}
          onAddFilter={onAddFilter}
          onManageTags={onManageTags}
        >
          <Button variant="ghost" size="sm" className="gap-1.5 h-7">
            <Plus className="h-3.5 w-3.5" />
            Filter
          </Button>
        </ScopedFilterDropdown>

        {/* Clear button - show only when there are user filters */}
        {hasUserFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-text-tertiary hover:text-text-secondary h-7 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

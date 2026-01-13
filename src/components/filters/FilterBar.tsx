import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { FilterPill } from './FilterPill';
import { FilterDropdown } from './FilterDropdown';
import type { Filter, FilterType, FilterOperator, DateRange } from '../../types/filters';

interface FilterBarProps {
  filters: Filter[];
  onAddFilter: (type: FilterType, operator: FilterOperator, value: string | string[] | DateRange) => void;
  onUpdateFilter: (id: string, updates: Partial<Omit<Filter, 'id'>>) => void;
  onRemoveFilter: (id: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  filters,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap py-3">
      {/* Existing filters */}
      {filters.map((filter) => (
        <FilterPill
          key={filter.id}
          filter={filter}
          onUpdate={(updates) => onUpdateFilter(filter.id, updates)}
          onRemove={() => onRemoveFilter(filter.id)}
        />
      ))}

      {/* Add filter button */}
      <FilterDropdown onAddFilter={onAddFilter}>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {filters.length === 0 ? 'Filter' : 'Add filter'}
        </Button>
      </FilterDropdown>

      {/* Clear all button */}
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-text-tertiary hover:text-text-secondary ml-auto"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
}


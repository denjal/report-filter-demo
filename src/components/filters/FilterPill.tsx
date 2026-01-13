import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/Popover';
import { ScopedFilterValueSelector } from './ScopedFilterValueSelector';
import { cn } from '../../lib/cn';
import type { Filter, FilterType, FilterOperator, DateRange } from '../../types/filters';
import { filterTypeConfig, operatorLabels, statusOptions, employmentTypeOptions } from '../../types/filters';
import { 
  departmentOptions, 
  costCenterOptions, 
  locationOptions, 
  workRoleOptions, 
  managerOptions 
} from '../../data/mock-data';
import { getFilterDisplayValue } from '../../lib/filter-utils';
import { useUser } from '../../context/UserContext';

interface FilterPillProps {
  filter: Filter;
  onUpdate: (updates: Partial<Omit<Filter, 'id'>>) => void;
  onRemove: () => void;
  scopeId?: string;
}

export function FilterPill({ filter, onUpdate, onRemove, scopeId }: FilterPillProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const { currentUser } = useUser();
  const config = filterTypeConfig[filter.type];
  
  // Get the scope if scopeId is provided
  const scope = scopeId 
    ? currentUser.scopes.find(s => s.id === scopeId)
    : currentUser.scopes[0]; // Default to first scope
  
  const displayValue = getFilterDisplayValue(filter, getOptionsForType(filter.type));

  const handleOperatorChange = (operator: FilterOperator) => {
    onUpdate({ operator });
    setOperatorOpen(false);
  };

  const handleValueChange = (value: string | string[] | DateRange) => {
    onUpdate({ value });
  };

  return (
    <div className="group inline-flex items-center gap-0.5 rounded-md bg-surface-2 border border-border text-sm h-7 animate-in fade-in-0 zoom-in-95 duration-150">
      {/* Filter type label */}
      <span className="pl-2.5 pr-1 text-text-secondary font-medium">
        {config.label}
      </span>

      {/* Operator selector */}
      <Popover open={operatorOpen} onOpenChange={setOperatorOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'px-1 text-text-tertiary hover:text-text-secondary transition-colors',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded'
            )}
          >
            {operatorLabels[filter.operator]}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-1" align="start">
          <div className="space-y-0.5">
            {config.operators.map((op) => (
              <button
                key={op}
                onClick={() => handleOperatorChange(op)}
                className={cn(
                  'w-full px-2 py-1.5 text-left text-sm rounded-md transition-colors',
                  'hover:bg-surface-3',
                  op === filter.operator && 'bg-surface-3 text-text-primary',
                  op !== filter.operator && 'text-text-secondary'
                )}
              >
                {operatorLabels[op]}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Value selector */}
      <Popover open={editOpen} onOpenChange={setEditOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-1 pl-1 pr-1.5 text-text-primary hover:text-text-primary transition-colors',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded'
            )}
          >
            <span className="max-w-[150px] truncate">{displayValue}</span>
            <ChevronDown className="h-3 w-3 text-text-tertiary" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          {scope && (
            <ScopedFilterValueSelector
              filterType={filter.type}
              operator={filter.operator}
              value={filter.value}
              scope={scope}
              onChange={handleValueChange}
            />
          )}
        </PopoverContent>
      </Popover>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className={cn(
          'h-full px-1.5 text-text-tertiary hover:text-text-primary transition-colors',
          'hover:bg-surface-3 rounded-r-md border-l border-border',
          'focus:outline-none focus-visible:ring-1 focus-visible:ring-accent'
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function getOptionsForType(type: FilterType) {
  switch (type) {
    case 'status':
      return statusOptions;
    case 'department':
      return departmentOptions;
    case 'cost_center':
      return costCenterOptions;
    case 'location':
      return locationOptions;
    case 'work_role':
      return workRoleOptions;
    case 'manager':
      return managerOptions;
    case 'employment_type':
      return employmentTypeOptions;
    default:
      return [];
  }
}

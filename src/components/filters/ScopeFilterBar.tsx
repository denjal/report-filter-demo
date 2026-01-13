import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScopeBranch } from './ScopeBranch';
import { useUser } from '../../context/UserContext';
import { useScopedFilters } from '../../hooks/useScopedFilters';
import type { AbsenceRequest } from '../../types/filters';

interface ScopeFilterBarProps {
  data: AbsenceRequest[];
}

export function ScopeFilterBar({ data }: ScopeFilterBarProps) {
  const { currentUser } = useUser();
  const {
    addFilterToScope,
    updateFilterInScope,
    removeFilterFromScope,
    clearScopeFilters,
    clearAllFilters,
    applyAllFilters,
    hasActiveFilters,
    getFiltersForScope,
  } = useScopedFilters(currentUser.scopes);

  // Apply filters whenever they change
  const filteredData = applyAllFilters(data, currentUser.scopes);
  
  // Notify parent of filtered data changes
  // Using a simple approach - parent will call this component with data
  // and we return filtered results through a render prop pattern alternative
  
  const hasMultipleScopes = currentUser.scopes.length > 1;

  return (
    <div className="space-y-3">
      {/* Header with clear all */}
      {hasActiveFilters && (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-tertiary hover:text-text-secondary"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear all filters
          </Button>
        </div>
      )}

      {/* Scope branches */}
      <div className="space-y-3">
        {currentUser.scopes.map((scope, index) => (
          <div key={scope.id}>
            <ScopeBranch
              scope={scope}
              filters={getFiltersForScope(scope.id)}
              onAddFilter={(type, operator, value) => 
                addFilterToScope(scope.id, type, operator, value)
              }
              onUpdateFilter={(filterId, updates) => 
                updateFilterInScope(scope.id, filterId, updates)
              }
              onRemoveFilter={(filterId) => 
                removeFilterFromScope(scope.id, filterId)
              }
              onClearFilters={() => clearScopeFilters(scope.id)}
            />
            
            {/* OR divider between scopes */}
            {hasMultipleScopes && index < currentUser.scopes.length - 1 && (
              <div className="flex items-center gap-4 my-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-2">
                  or
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results info when filters are active */}
      {hasActiveFilters && (
        <div className="text-xs text-text-tertiary pt-2 border-t border-border">
          Showing {filteredData.length} of {data.length} requests based on your filters and access scopes
        </div>
      )}
    </div>
  );
}

// Export a hook version for App.tsx to get filtered data
export function useScopeFilteredData(data: AbsenceRequest[]) {
  const { currentUser } = useUser();
  const scopedFilters = useScopedFilters(currentUser.scopes);
  
  const filteredData = scopedFilters.applyAllFilters(data, currentUser.scopes);
  
  return {
    filteredData,
    ...scopedFilters,
  };
}


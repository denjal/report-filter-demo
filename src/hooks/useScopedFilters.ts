import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Filter, FilterType, FilterOperator, AbsenceRequest } from '../types/filters';
import type { PermissionScope } from '../types/permissions';
import { generateFilterId } from '../lib/filter-utils';
import { filterAbsenceRequests } from '../lib/filter-utils';

// Filters for a single scope/branch
export interface ScopeFilters {
  scopeId: string;
  filters: Filter[];
}

interface UseScopedFiltersReturn {
  scopeFilters: ScopeFilters[];
  addFilterToScope: (scopeId: string, type: FilterType, operator: FilterOperator, value: Filter['value'], tagKey?: string) => void;
  updateFilterInScope: (scopeId: string, filterId: string, updates: Partial<Omit<Filter, 'id'>>) => void;
  removeFilterFromScope: (scopeId: string, filterId: string) => void;
  clearScopeFilters: (scopeId: string) => void;
  clearAllFilters: () => void;
  applyAllFilters: (requests: AbsenceRequest[], scopes: PermissionScope[]) => AbsenceRequest[];
  hasActiveFilters: boolean;
  getFiltersForScope: (scopeId: string) => Filter[];
}

export function useScopedFilters(initialScopes: PermissionScope[]): UseScopedFiltersReturn {
  // Initialize with empty filters for each scope
  const [scopeFilters, setScopeFilters] = useState<ScopeFilters[]>(() =>
    initialScopes.map(scope => ({
      scopeId: scope.id,
      filters: [],
    }))
  );

  // Reset filters when scopes change (user switches)
  useEffect(() => {
    setScopeFilters(
      initialScopes.map(scope => ({
        scopeId: scope.id,
        filters: [],
      }))
    );
  }, [initialScopes]);

  const addFilterToScope = useCallback((
    scopeId: string,
    type: FilterType,
    operator: FilterOperator,
    value: Filter['value'],
    tagKey?: string
  ) => {
    const newFilter: Filter = {
      id: generateFilterId(),
      type,
      operator,
      value,
      ...(tagKey && { tagKey }),
    };
    setScopeFilters(prev => prev.map(sf =>
      sf.scopeId === scopeId
        ? { ...sf, filters: [...sf.filters, newFilter] }
        : sf
    ));
  }, []);

  const updateFilterInScope = useCallback((
    scopeId: string,
    filterId: string,
    updates: Partial<Omit<Filter, 'id'>>
  ) => {
    setScopeFilters(prev => prev.map(sf =>
      sf.scopeId === scopeId
        ? {
            ...sf,
            filters: sf.filters.map(f =>
              f.id === filterId ? { ...f, ...updates } : f
            ),
          }
        : sf
    ));
  }, []);

  const removeFilterFromScope = useCallback((scopeId: string, filterId: string) => {
    setScopeFilters(prev => prev.map(sf =>
      sf.scopeId === scopeId
        ? { ...sf, filters: sf.filters.filter(f => f.id !== filterId) }
        : sf
    ));
  }, []);

  const clearScopeFilters = useCallback((scopeId: string) => {
    setScopeFilters(prev => prev.map(sf =>
      sf.scopeId === scopeId
        ? { ...sf, filters: [] }
        : sf
    ));
  }, []);

  const clearAllFilters = useCallback(() => {
    setScopeFilters(prev => prev.map(sf => ({ ...sf, filters: [] })));
  }, []);

  const getFiltersForScope = useCallback((scopeId: string): Filter[] => {
    return scopeFilters.find(sf => sf.scopeId === scopeId)?.filters ?? [];
  }, [scopeFilters]);

  // Apply filters from all scopes (UNION/OR logic)
  const applyAllFilters = useCallback((
    requests: AbsenceRequest[],
    scopes: PermissionScope[]
  ): AbsenceRequest[] => {
    // For each scope, get matching requests
    const resultSets = scopes.map(scope => {
      const scopeFilter = scopeFilters.find(sf => sf.scopeId === scope.id);
      
      // Build combined filters: required filters + user-added filters
      const allFilters: Filter[] = [
        // Required filters from scope
        ...scope.requiredFilters.map((rf, idx) => ({
          id: `required-${scope.id}-${idx}`,
          type: rf.tag,
          operator: 'is' as FilterOperator,
          value: rf.value,
          ...(rf.tagKey && { tagKey: rf.tagKey }),
        })),
        // User-added filters
        ...(scopeFilter?.filters ?? []),
      ];

      return filterAbsenceRequests(requests, allFilters);
    });

    // Union all result sets (OR logic between scopes)
    const allIds = new Set<string>();
    const unionResults: AbsenceRequest[] = [];
    
    for (const resultSet of resultSets) {
      for (const request of resultSet) {
        if (!allIds.has(request.id)) {
          allIds.add(request.id);
          unionResults.push(request);
        }
      }
    }

    // Sort by start date descending
    return unionResults.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [scopeFilters]);

  const hasActiveFilters = useMemo(() => 
    scopeFilters.some(sf => sf.filters.length > 0),
    [scopeFilters]
  );

  return {
    scopeFilters,
    addFilterToScope,
    updateFilterInScope,
    removeFilterFromScope,
    clearScopeFilters,
    clearAllFilters,
    applyAllFilters,
    hasActiveFilters,
    getFiltersForScope,
  };
}


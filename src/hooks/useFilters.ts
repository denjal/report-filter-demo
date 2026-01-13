import { useState, useCallback, useMemo } from 'react';
import type { Filter, FilterType, FilterOperator, DateRange, AbsenceRequest } from '../types/filters';
import { filterAbsenceRequests, generateFilterId } from '../lib/filter-utils';

interface UseFiltersReturn {
  filters: Filter[];
  addFilter: (type: FilterType, operator: FilterOperator, value: Filter['value']) => void;
  updateFilter: (id: string, updates: Partial<Omit<Filter, 'id'>>) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  applyFilters: (requests: AbsenceRequest[]) => AbsenceRequest[];
  getFilterById: (id: string) => Filter | undefined;
  hasActiveFilters: boolean;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filter[]>([]);

  const addFilter = useCallback((
    type: FilterType,
    operator: FilterOperator,
    value: Filter['value']
  ) => {
    const newFilter: Filter = {
      id: generateFilterId(),
      type,
      operator,
      value,
    };
    setFilters(prev => [...prev, newFilter]);
  }, []);

  const updateFilter = useCallback((
    id: string,
    updates: Partial<Omit<Filter, 'id'>>
  ) => {
    setFilters(prev => prev.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const applyFilters = useCallback((requests: AbsenceRequest[]) => {
    return filterAbsenceRequests(requests, filters);
  }, [filters]);

  const getFilterById = useCallback((id: string) => {
    return filters.find(f => f.id === id);
  }, [filters]);

  const hasActiveFilters = useMemo(() => filters.length > 0, [filters]);

  return {
    filters,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    applyFilters,
    getFilterById,
    hasActiveFilters,
  };
}

// Helper hook to serialize filters to URL params (for future use)
export function useFilterParams(filters: Filter[]): string {
  return useMemo(() => {
    if (filters.length === 0) return '';
    
    const params = filters.map(filter => {
      const value = (() => {
        if (Array.isArray(filter.value)) return filter.value.join(',');
        if (typeof filter.value === 'object' && 'from' in filter.value) {
          const dateRange = filter.value as DateRange;
          const toPart = dateRange.to ? `,${dateRange.to.toISOString()}` : '';
          return `${dateRange.from.toISOString()}${toPart}`;
        }
        return filter.value;
      })();
      
      return `${filter.type}:${filter.operator}:${value}`;
    });
    
    return params.join('|');
  }, [filters]);
}

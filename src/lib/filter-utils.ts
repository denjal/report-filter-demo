import { isBefore, isAfter, isWithinInterval } from 'date-fns';
import type { Filter, AbsenceRequest, DateRange } from '../types/filters';

// Apply a single filter to an absence request
export function applyFilter(request: AbsenceRequest, filter: Filter): boolean {
  const { type, operator, value } = filter;

  switch (type) {
    case 'status': {
      return applyStringFilter(request.status, operator, value);
    }
    
    case 'department': {
      return applyStringFilter(request.employee.department.id, operator, value);
    }
    
    case 'cost_center': {
      return applyStringFilter(request.employee.costCenter.id, operator, value);
    }
    
    case 'location': {
      return applyStringFilter(request.employee.location.id, operator, value);
    }
    
    case 'work_role': {
      return applyStringFilter(request.employee.workRole.id, operator, value);
    }
    
    case 'manager': {
      const managerId = request.employee.manager?.id;
      if (!managerId) {
        if (operator === 'is' || operator === 'is_any_of') return false;
        if (operator === 'is_not' || operator === 'is_none_of') return true;
      }
      return applyStringFilter(managerId || '', operator, value);
    }
    
    case 'employment_type': {
      return applyStringFilter(request.employee.employmentType, operator, value);
    }
    
    case 'start_date': {
      return applyDateFilter(request.startDate, operator, value);
    }
    
    case 'end_date': {
      return applyDateFilter(request.endDate, operator, value);
    }
    
    case 'custom_tag': {
      // Custom tag filtering - check request.tags
      const tagKey = filter.tagKey;
      if (!tagKey || !request.tags) {
        // No tag key or no tags on request - filter based on operator
        if (operator === 'is' || operator === 'is_any_of') return false;
        if (operator === 'is_not' || operator === 'is_none_of') return true;
        return false;
      }
      
      const requestTagValue = request.tags[tagKey];
      if (!requestTagValue) {
        // Request doesn't have this tag
        if (operator === 'is' || operator === 'is_any_of') return false;
        if (operator === 'is_not' || operator === 'is_none_of') return true;
        return false;
      }
      
      return applyStringFilter(requestTagValue, operator, value);
    }
    
    default:
      return true;
  }
}

// Apply string-based filter
function applyStringFilter(
  itemValue: string,
  operator: Filter['operator'],
  filterValue: Filter['value']
): boolean {
  switch (operator) {
    case 'is':
      return Array.isArray(filterValue) 
        ? filterValue.includes(itemValue)
        : itemValue === filterValue;
    
    case 'is_not':
      return Array.isArray(filterValue)
        ? !filterValue.includes(itemValue)
        : itemValue !== filterValue;
    
    case 'is_any_of':
      return Array.isArray(filterValue) && filterValue.includes(itemValue);
    
    case 'is_none_of':
      return Array.isArray(filterValue) && !filterValue.includes(itemValue);
    
    default:
      return true;
  }
}

// Apply date-based filter
function applyDateFilter(
  itemDate: Date,
  operator: Filter['operator'],
  filterValue: Filter['value']
): boolean {
  if (typeof filterValue === 'string' || Array.isArray(filterValue)) {
    const compareDate = new Date(filterValue as string);
    switch (operator) {
      case 'before':
        return isBefore(itemDate, compareDate);
      case 'after':
        return isAfter(itemDate, compareDate);
      default:
        return true;
    }
  }
  
  // DateRange
  const dateRange = filterValue as DateRange;
  switch (operator) {
    case 'before':
      return isBefore(itemDate, dateRange.from);
    case 'after':
      return isAfter(itemDate, dateRange.from);
    case 'between':
      if (!dateRange.to) return isAfter(itemDate, dateRange.from);
      return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
    default:
      return true;
  }
}

// Apply all filters to a list of absence requests
export function filterAbsenceRequests(requests: AbsenceRequest[], filters: Filter[]): AbsenceRequest[] {
  if (filters.length === 0) return requests;
  
  return requests.filter(request => 
    filters.every(filter => applyFilter(request, filter))
  );
}

// Generate a unique filter ID
export function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get display value for a filter
export function getFilterDisplayValue(
  filter: Filter,
  options: { value: string; label: string }[]
): string {
  const { value, operator } = filter;
  
  if (Array.isArray(value)) {
    const labels = value.map(v => {
      const option = options.find(o => o.value === v);
      return option?.label || v;
    });
    
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return labels.join(' or ');
    return `${labels.length} selected`;
  }
  
  if (typeof value === 'object' && 'from' in value) {
    const dateRange = value as DateRange;
    if (operator === 'between' && dateRange.to) {
      return `${formatDateShort(dateRange.from)} - ${formatDateShort(dateRange.to)}`;
    }
    return formatDateShort(dateRange.from);
  }
  
  const option = options.find(o => o.value === value);
  return option?.label || String(value);
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

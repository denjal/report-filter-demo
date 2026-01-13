import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '../ui/Command';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';
import type { FilterType, FilterOperator, DateRange, FilterOption } from '../../types/filters';
import { statusOptions, employmentTypeOptions } from '../../types/filters';
import type { PermissionScope } from '../../types/permissions';
import { 
  departmentOptions, 
  costCenterOptions, 
  locationOptions, 
  workRoleOptions, 
  managerOptions 
} from '../../data/mock-data';

interface ScopedFilterValueSelectorProps {
  filterType: FilterType;
  operator: FilterOperator;
  value: string | string[] | DateRange | null;
  scope: PermissionScope;
  onChange: (value: string | string[] | DateRange) => void;
}

export function ScopedFilterValueSelector({
  filterType,
  operator,
  value,
  scope,
  onChange,
}: ScopedFilterValueSelectorProps) {
  // Date filter - no restrictions
  if (filterType === 'start_date' || filterType === 'end_date') {
    return (
      <DateSelector
        operator={operator}
        value={value as DateRange | null}
        onChange={onChange}
      />
    );
  }

  // Get options and allowed values based on scope
  const options = getOptionsForType(filterType);
  const allowedValues = getAllowedValuesForType(filterType, scope);
  
  const isMulti = operator === 'is_any_of' || operator === 'is_none_of';
  const selectedValues = Array.isArray(value) ? value : value ? [value as string] : [];

  return (
    <ScopedMultiSelectList
      options={options}
      allowedValues={allowedValues}
      selectedValues={selectedValues}
      onChange={(values) => {
        if (isMulti) {
          onChange(values);
        } else {
          onChange(values[0] || '');
        }
      }}
      isMulti={isMulti}
    />
  );
}

function getOptionsForType(type: FilterType): FilterOption[] {
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

// Get allowed values for a filter type based on scope restrictions
function getAllowedValuesForType(type: FilterType, scope: PermissionScope): string[] | null {
  // Check if this tag is restricted in the scope
  const restriction = scope.restrictedTags?.find(r => r.tag === type);
  if (restriction) {
    return restriction.allowedValues;
  }
  // No restriction - return null to indicate all values are allowed
  return null;
}

interface ScopedMultiSelectListProps {
  options: FilterOption[];
  allowedValues: string[] | null;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isMulti: boolean;
}

function ScopedMultiSelectList({ 
  options, 
  allowedValues, 
  selectedValues, 
  onChange, 
  isMulti 
}: ScopedMultiSelectListProps) {
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (optionValue: string) => {
    // Check if allowed
    if (allowedValues !== null && !allowedValues.includes(optionValue)) {
      return; // Can't select restricted options
    }

    if (isMulti) {
      const isSelected = selectedValues.includes(optionValue);
      if (isSelected) {
        onChange(selectedValues.filter(v => v !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    } else {
      onChange([optionValue]);
    }
  };

  const isDisabled = (optionValue: string): boolean => {
    if (allowedValues === null) return false;
    return !allowedValues.includes(optionValue);
  };

  return (
    <Command>
      <CommandInput 
        placeholder="Search..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const disabled = isDisabled(option.value);
            
            return (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
                disabled={disabled}
                className={cn(
                  'gap-2',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isMulti && (
                  <Checkbox 
                    checked={isSelected}
                    disabled={disabled}
                    className="pointer-events-none"
                  />
                )}
                {option.color && !disabled && (
                  <span 
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                {disabled && (
                  <Lock className="h-3 w-3 text-text-tertiary shrink-0" />
                )}
                <span className={cn(
                  'flex-1',
                  isSelected && !isMulti && 'font-medium',
                  disabled && 'text-text-tertiary'
                )}>
                  {option.label}
                </span>
                {disabled && (
                  <span className="text-xs text-text-tertiary">Restricted</span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

// Date selector (same as before, no restrictions on dates)
interface DateSelectorProps {
  operator: FilterOperator;
  value: DateRange | null;
  onChange: (value: DateRange) => void;
}

function DateSelector({ operator, value, onChange }: DateSelectorProps) {
  const [viewDate, setViewDate] = useState(value?.from || new Date());
  const [selectingEnd, setSelectingEnd] = useState(false);
  const isRange = operator === 'between';

  const presets = [
    { label: 'Today', getValue: () => ({ from: new Date() }) },
    { label: 'Tomorrow', getValue: () => ({ from: addDays(new Date(), 1) }) },
    { label: 'This week', getValue: () => ({ 
      from: startOfWeek(new Date(), { weekStartsOn: 1 }), 
      to: endOfWeek(new Date(), { weekStartsOn: 1 }) 
    }) },
    { label: 'This month', getValue: () => ({ 
      from: startOfMonth(new Date()), 
      to: endOfMonth(new Date()) 
    }) },
    { label: 'Next 7 days', getValue: () => ({ 
      from: new Date(), 
      to: addDays(new Date(), 7) 
    }) },
    { label: 'Next 30 days', getValue: () => ({ 
      from: new Date(), 
      to: addDays(new Date(), 30) 
    }) },
  ];

  const handleDaySelect = (day: Date) => {
    if (isRange) {
      if (!selectingEnd || !value?.from) {
        onChange({ from: day });
        setSelectingEnd(true);
      } else {
        if (day < value.from) {
          onChange({ from: day, to: value.from });
        } else {
          onChange({ from: value.from, to: day });
        }
        setSelectingEnd(false);
      }
    } else {
      onChange({ from: day });
    }
  };

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const presetValue = preset.getValue();
    onChange(presetValue);
    setSelectingEnd(false);
  };

  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-border">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            onClick={() => handlePresetSelect(preset)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-text-primary">
          {format(viewDate, 'MMMM yyyy')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <CalendarGrid
        viewDate={viewDate}
        selectedRange={value}
        onDaySelect={handleDaySelect}
        isRange={isRange}
      />

      {value?.from && (
        <div className="mt-3 pt-3 border-t border-border text-xs text-text-secondary flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {format(value.from, 'MMM d, yyyy')}
            {value.to && ` – ${format(value.to, 'MMM d, yyyy')}`}
          </span>
        </div>
      )}
    </div>
  );
}

interface CalendarGridProps {
  viewDate: Date;
  selectedRange: DateRange | null;
  onDaySelect: (day: Date) => void;
  isRange: boolean;
}

function CalendarGrid({ viewDate, selectedRange, onDaySelect, isRange }: CalendarGridProps) {
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startPad = firstDay.getDay() - 1;
    if (startPad < 0) startPad = 6;
    
    const result: (Date | null)[] = [];
    
    for (let i = 0; i < startPad; i++) {
      result.push(null);
    }
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      result.push(new Date(year, month, d));
    }
    
    return result;
  }, [viewDate]);

  const isSelected = (day: Date) => {
    if (!selectedRange?.from) return false;
    const dayStr = format(day, 'yyyy-MM-dd');
    const fromStr = format(selectedRange.from, 'yyyy-MM-dd');
    if (selectedRange.to) {
      const toStr = format(selectedRange.to, 'yyyy-MM-dd');
      return dayStr >= fromStr && dayStr <= toStr;
    }
    return dayStr === fromStr;
  };

  const isRangeStart = (day: Date) => {
    if (!selectedRange?.from) return false;
    return format(day, 'yyyy-MM-dd') === format(selectedRange.from, 'yyyy-MM-dd');
  };

  const isRangeEnd = (day: Date) => {
    if (!selectedRange?.to) return false;
    return format(day, 'yyyy-MM-dd') === format(selectedRange.to, 'yyyy-MM-dd');
  };

  const isToday = (day: Date) => {
    return format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  };

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {weekDays.map(day => (
        <div key={day} className="h-8 flex items-center justify-center text-xs text-text-tertiary font-medium">
          {day}
        </div>
      ))}
      {days.map((day, idx) => (
        <div key={idx} className="h-8">
          {day && (
            <button
              onClick={() => onDaySelect(day)}
              className={cn(
                'w-full h-full text-xs rounded-md transition-colors',
                'hover:bg-surface-3',
                isSelected(day) && 'bg-accent/20 text-accent',
                isRangeStart(day) && isRange && 'rounded-r-none',
                isRangeEnd(day) && isRange && 'rounded-l-none',
                (isRangeStart(day) || isRangeEnd(day)) && 'bg-accent text-white hover:bg-accent',
                isToday(day) && !isSelected(day) && 'border border-accent text-accent',
              )}
            >
              {day.getDate()}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}


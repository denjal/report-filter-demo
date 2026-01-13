import { useState } from 'react';
import { 
  CircleDot,
  Building2,
  Wallet,
  MapPin,
  Briefcase,
  UserCheck,
  BadgeCheck,
  Calendar,
  CalendarCheck,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/Popover';
import { Button } from '../ui/Button';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
} from '../ui/Command';
import { FilterValueSelector } from './FilterValueSelector';
import type { 
  FilterType, 
  FilterOperator, 
  DateRange,
} from '../../types/filters';
import { filterTypeConfig, operatorLabels } from '../../types/filters';

interface FilterDropdownProps {
  onAddFilter: (type: FilterType, operator: FilterOperator, value: string | string[] | DateRange) => void;
  children: React.ReactNode;
}

type Step = 'select-type' | 'select-operator' | 'select-value';

const filterTypeIcons: Record<FilterType, React.ReactNode> = {
  status: <CircleDot className="h-4 w-4" />,
  department: <Building2 className="h-4 w-4" />,
  cost_center: <Wallet className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  work_role: <Briefcase className="h-4 w-4" />,
  manager: <UserCheck className="h-4 w-4" />,
  employment_type: <BadgeCheck className="h-4 w-4" />,
  start_date: <Calendar className="h-4 w-4" />,
  end_date: <CalendarCheck className="h-4 w-4" />,
};

export function FilterDropdown({ onAddFilter, children }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('select-type');
  const [selectedType, setSelectedType] = useState<FilterType | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | string[] | DateRange | null>(null);

  const reset = () => {
    setStep('select-type');
    setSelectedType(null);
    setSelectedOperator(null);
    setSelectedValue(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when closing
      setTimeout(reset, 150);
    }
  };

  const handleSelectType = (type: FilterType) => {
    setSelectedType(type);
    const config = filterTypeConfig[type];
    
    // Skip operator selection for simple cases
    if (config.operators.length === 1) {
      setSelectedOperator(config.operators[0]);
      setStep('select-value');
    } else {
      setStep('select-operator');
    }
  };

  const handleSelectOperator = (operator: FilterOperator) => {
    setSelectedOperator(operator);
    setStep('select-value');
  };

  const handleValueChange = (value: string | string[] | DateRange) => {
    setSelectedValue(value);
  };

  const handleApply = () => {
    if (selectedType && selectedOperator && selectedValue) {
      onAddFilter(selectedType, selectedOperator, selectedValue);
      handleOpenChange(false);
    }
  };

  const handleBack = () => {
    if (step === 'select-value') {
      const config = selectedType ? filterTypeConfig[selectedType] : null;
      if (config && config.operators.length === 1) {
        setStep('select-type');
        setSelectedType(null);
        setSelectedOperator(null);
      } else {
        setStep('select-operator');
        setSelectedOperator(null);
      }
      setSelectedValue(null);
    } else if (step === 'select-operator') {
      setStep('select-type');
      setSelectedType(null);
    }
  };

  const canApply = selectedType && selectedOperator && selectedValue && (
    Array.isArray(selectedValue) ? selectedValue.length > 0 : true
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {step === 'select-type' && (
          <SelectTypeStep onSelect={handleSelectType} />
        )}
        
        {step === 'select-operator' && selectedType && (
          <SelectOperatorStep
            filterType={selectedType}
            onSelect={handleSelectOperator}
            onBack={handleBack}
          />
        )}
        
        {step === 'select-value' && selectedType && selectedOperator && (
          <SelectValueStep
            filterType={selectedType}
            operator={selectedOperator}
            value={selectedValue}
            onChange={handleValueChange}
            onBack={handleBack}
            onApply={handleApply}
            canApply={!!canApply}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function SelectTypeStep({ onSelect }: { onSelect: (type: FilterType) => void }) {
  const filterTypes = Object.values(filterTypeConfig);

  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandEmpty>No filter types found.</CommandEmpty>
        <CommandGroup heading="Filter by">
          {filterTypes.map((config) => (
            <CommandItem
              key={config.type}
              value={config.type}
              onSelect={() => onSelect(config.type)}
              className="gap-2"
            >
              <span className="text-text-tertiary">
                {filterTypeIcons[config.type]}
              </span>
              <span>{config.label}</span>
              <ChevronRight className="ml-auto h-4 w-4 text-text-tertiary" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

interface SelectOperatorStepProps {
  filterType: FilterType;
  onSelect: (operator: FilterOperator) => void;
  onBack: () => void;
}

function SelectOperatorStep({ filterType, onSelect, onBack }: SelectOperatorStepProps) {
  const config = filterTypeConfig[filterType];

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-text-secondary flex items-center gap-2">
          <span className="text-text-tertiary">{filterTypeIcons[filterType]}</span>
          {config.label}
        </span>
      </div>
      <Command>
        <CommandList>
          <CommandGroup heading="Condition">
            {config.operators.map((operator) => (
              <CommandItem
                key={operator}
                value={operator}
                onSelect={() => onSelect(operator)}
              >
                {operatorLabels[operator]}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

interface SelectValueStepProps {
  filterType: FilterType;
  operator: FilterOperator;
  value: string | string[] | DateRange | null;
  onChange: (value: string | string[] | DateRange) => void;
  onBack: () => void;
  onApply: () => void;
  canApply: boolean;
}

function SelectValueStep({
  filterType,
  operator,
  value,
  onChange,
  onBack,
  onApply,
  canApply,
}: SelectValueStepProps) {
  const config = filterTypeConfig[filterType];

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-text-secondary flex items-center gap-2">
          <span className="text-text-tertiary">{filterTypeIcons[filterType]}</span>
          {config.label}
          <span className="text-text-tertiary">·</span>
          <span className="text-text-tertiary">{operatorLabels[operator]}</span>
        </span>
      </div>
      
      <FilterValueSelector
        filterType={filterType}
        operator={operator}
        value={value}
        onChange={onChange}
      />
      
      <div className="p-2 border-t border-border">
        <Button 
          onClick={onApply} 
          disabled={!canApply}
          className="w-full"
        >
          Apply filter
        </Button>
      </div>
    </div>
  );
}

// Export icons for use in FilterPill
export { filterTypeIcons };

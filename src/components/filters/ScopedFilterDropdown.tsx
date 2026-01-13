import { useState, useMemo } from 'react';
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
  Tag,
  Settings,
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
  CommandSeparator,
} from '../ui/Command';
import { Checkbox } from '../ui/Checkbox';
import { ScopedFilterValueSelector } from './ScopedFilterValueSelector';
import { useCustomTags } from '../../hooks/useCustomTags';
import { cn } from '../../lib/cn';
import type { 
  FilterType, 
  FilterOperator, 
  DateRange,
  CustomTag,
} from '../../types/filters';
import { filterTypeConfig, operatorLabels } from '../../types/filters';
import type { PermissionScope } from '../../types/permissions';

interface ScopedFilterDropdownProps {
  scope: PermissionScope;
  usedTags: Set<FilterType>;
  onAddFilter: (type: FilterType, operator: FilterOperator, value: string | string[] | DateRange, tagKey?: string) => void;
  onManageTags: () => void;
  children: React.ReactNode;
}

type Step = 
  | 'select-type' 
  | 'select-operator' 
  | 'select-value'
  | 'select-tag'
  | 'select-tag-operator'
  | 'select-tag-values';

const filterTypeIcons: Partial<Record<FilterType, React.ReactNode>> = {
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

export function ScopedFilterDropdown({ scope, usedTags, onAddFilter, onManageTags, children }: ScopedFilterDropdownProps) {
  const { allTags } = useCustomTags();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('select-type');
  const [selectedType, setSelectedType] = useState<FilterType | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | string[] | DateRange | null>(null);
  
  // Tag-specific state
  const [selectedTag, setSelectedTag] = useState<CustomTag | null>(null);
  const [selectedTagValues, setSelectedTagValues] = useState<string[]>([]);

  const reset = () => {
    setStep('select-type');
    setSelectedType(null);
    setSelectedOperator(null);
    setSelectedValue(null);
    setSelectedTag(null);
    setSelectedTagValues([]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(reset, 150);
    }
  };

  const handleSelectType = (type: FilterType) => {
    setSelectedType(type);
    const config = filterTypeConfig[type];
    
    if (config.operators.length === 1) {
      setSelectedOperator(config.operators[0]);
      setStep('select-value');
    } else {
      setStep('select-operator');
    }
  };

  const handleSelectTags = () => {
    setStep('select-tag');
  };

  const handleSelectTag = (tag: CustomTag) => {
    setSelectedTag(tag);
    setStep('select-tag-operator');
  };

  const handleSelectTagOperator = (operator: FilterOperator) => {
    setSelectedOperator(operator);
    setStep('select-tag-values');
  };

  const handleToggleTagValue = (value: string) => {
    setSelectedTagValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleApplyTagFilter = () => {
    if (selectedTag && selectedOperator && selectedTagValues.length > 0) {
      onAddFilter(
        'custom_tag',
        selectedOperator,
        selectedTagValues.length === 1 ? selectedTagValues[0] : selectedTagValues,
        selectedTag.key
      );
      handleOpenChange(false);
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
    } else if (step === 'select-tag') {
      setStep('select-type');
    } else if (step === 'select-tag-operator') {
      setStep('select-tag');
      setSelectedTag(null);
    } else if (step === 'select-tag-values') {
      setStep('select-tag-operator');
      setSelectedOperator(null);
      setSelectedTagValues([]);
    }
  };

  const handleManageTagsClick = () => {
    handleOpenChange(false);
    onManageTags();
  };

  const canApply = selectedType && selectedOperator && selectedValue && (
    Array.isArray(selectedValue) ? selectedValue.length > 0 : true
  );

  const canApplyTag = selectedTag && selectedOperator && selectedTagValues.length > 0;

  // Check if a tag is locked by scope's required filters
  const isTagLocked = (tag: FilterType): boolean => {
    return scope.requiredFilters.some(rf => rf.tag === tag);
  };

  // Get available filter types (excluding locked, already used, and custom_tag)
  const availableFilterTypes = Object.values(filterTypeConfig).filter(config => {
    // Exclude custom_tag - we handle it separately
    if (config.type === 'custom_tag') return false;
    // Exclude locked tags
    if (isTagLocked(config.type)) return false;
    // Exclude already used tags
    if (usedTags.has(config.type)) return false;
    return true;
  });

  const tagOperators: FilterOperator[] = ['is', 'is_not', 'is_any_of', 'is_none_of'];

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {step === 'select-type' && (
          <SelectTypeStep 
            availableTypes={availableFilterTypes}
            onSelect={handleSelectType}
            onSelectTags={handleSelectTags}
          />
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
            scope={scope}
            onChange={handleValueChange}
            onBack={handleBack}
            onApply={handleApply}
            canApply={!!canApply}
          />
        )}

        {step === 'select-tag' && (
          <SelectTagStep
            tags={allTags}
            onSelect={handleSelectTag}
            onBack={handleBack}
            onManageTags={handleManageTagsClick}
          />
        )}

        {step === 'select-tag-operator' && selectedTag && (
          <SelectTagOperatorStep
            tag={selectedTag}
            operators={tagOperators}
            onSelect={handleSelectTagOperator}
            onBack={handleBack}
          />
        )}

        {step === 'select-tag-values' && selectedTag && selectedOperator && (
          <SelectTagValuesStep
            tag={selectedTag}
            operator={selectedOperator}
            selectedValues={selectedTagValues}
            onToggleValue={handleToggleTagValue}
            onBack={handleBack}
            onApply={handleApplyTagFilter}
            canApply={!!canApplyTag}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function SelectTypeStep({ 
  availableTypes,
  onSelect,
  onSelectTags,
}: { 
  availableTypes: typeof filterTypeConfig[FilterType][];
  onSelect: (type: FilterType) => void;
  onSelectTags: () => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter by..." />
      <CommandList>
        <CommandGroup heading="Filter by">
          {availableTypes.map((config) => (
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
          <CommandItem
            value="tags"
            onSelect={onSelectTags}
            className="gap-2"
          >
            <span className="text-text-tertiary">
              <Tag className="h-4 w-4" />
            </span>
            <span>Tags</span>
            <ChevronRight className="ml-auto h-4 w-4 text-text-tertiary" />
          </CommandItem>
        </CommandGroup>
        {availableTypes.length === 0 && (
          <CommandEmpty>No more filters available.</CommandEmpty>
        )}
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
  scope: PermissionScope;
  onChange: (value: string | string[] | DateRange) => void;
  onBack: () => void;
  onApply: () => void;
  canApply: boolean;
}

function SelectValueStep({
  filterType,
  operator,
  value,
  scope,
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
      
      <ScopedFilterValueSelector
        filterType={filterType}
        operator={operator}
        value={value}
        scope={scope}
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

// Tag selection steps
interface SelectTagStepProps {
  tags: CustomTag[];
  onSelect: (tag: CustomTag) => void;
  onBack: () => void;
  onManageTags: () => void;
}

function SelectTagStep({ tags, onSelect, onBack, onManageTags }: SelectTagStepProps) {
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    if (!search) return tags;
    return tags.filter(t =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-text-secondary flex items-center gap-2">
          <Tag className="h-4 w-4 text-text-tertiary" />
          Tags
        </span>
      </div>
      <Command>
        <CommandInput
          placeholder="Search tags..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup heading="Select a tag">
            {filteredTags.map((tag) => (
              <CommandItem
                key={tag.key}
                value={tag.key}
                onSelect={() => onSelect(tag)}
                className="gap-2"
              >
                <Tag className="h-4 w-4 text-text-tertiary" />
                <span className="flex-1">{tag.label}</span>
                <span className="text-xs text-text-tertiary">
                  {tag.values.length} values
                </span>
                <ChevronRight className="h-4 w-4 text-text-tertiary" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={onManageTags}
              className="gap-2 text-text-secondary"
            >
              <Settings className="h-4 w-4" />
              <span>Manage Tags...</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

interface SelectTagOperatorStepProps {
  tag: CustomTag;
  operators: FilterOperator[];
  onSelect: (operator: FilterOperator) => void;
  onBack: () => void;
}

function SelectTagOperatorStep({ tag, operators, onSelect, onBack }: SelectTagOperatorStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-text-secondary flex items-center gap-2">
          <Tag className="h-4 w-4 text-text-tertiary" />
          {tag.label}
        </span>
      </div>
      <Command>
        <CommandList>
          <CommandGroup heading="Condition">
            {operators.map((operator) => (
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

interface SelectTagValuesStepProps {
  tag: CustomTag;
  operator: FilterOperator;
  selectedValues: string[];
  onToggleValue: (value: string) => void;
  onBack: () => void;
  onApply: () => void;
  canApply: boolean;
}

function SelectTagValuesStep({
  tag,
  operator,
  selectedValues,
  onToggleValue,
  onBack,
  onApply,
  canApply,
}: SelectTagValuesStepProps) {
  const [search, setSearch] = useState('');

  const filteredValues = useMemo(() => {
    if (!search) return tag.values;
    return tag.values.filter(v =>
      v.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [tag.values, search]);

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-text-secondary flex items-center gap-2">
          <Tag className="h-4 w-4 text-text-tertiary" />
          {tag.label}
          <span className="text-text-tertiary">·</span>
          <span className="text-text-tertiary">{operatorLabels[operator]}</span>
        </span>
      </div>
      
      <Command>
        <CommandInput
          placeholder="Search values..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No values found.</CommandEmpty>
          <CommandGroup>
            {filteredValues.map((value) => {
              const isSelected = selectedValues.includes(value.value);
              return (
                <CommandItem
                  key={value.value}
                  value={value.value}
                  onSelect={() => onToggleValue(value.value)}
                  className="gap-2"
                >
                  <Checkbox
                    checked={isSelected}
                    className="pointer-events-none"
                  />
                  <span className={cn('flex-1', isSelected && 'font-medium')}>
                    {value.label}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      
      <div className="p-2 border-t border-border">
        <Button
          onClick={onApply}
          disabled={!canApply}
          className="w-full"
        >
          Apply filter
          {selectedValues.length > 0 && (
            <span className="ml-1 text-xs opacity-70">
              ({selectedValues.length} selected)
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

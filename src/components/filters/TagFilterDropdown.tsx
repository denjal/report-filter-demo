import { useState, useMemo } from 'react';
import { Tag, ChevronRight, ArrowLeft, Settings } from 'lucide-react';
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
import { useCustomTags } from '../../hooks/useCustomTags';
import { cn } from '../../lib/cn';
import type { FilterOperator, CustomTag } from '../../types/filters';
import { operatorLabels } from '../../types/filters';

interface TagFilterDropdownProps {
  onAddFilter: (tagKey: string, operator: FilterOperator, value: string | string[]) => void;
  onManageTags: () => void;
  children: React.ReactNode;
}

type Step = 'select-tag' | 'select-operator' | 'select-values';

export function TagFilterDropdown({ onAddFilter, onManageTags, children }: TagFilterDropdownProps) {
  const { allTags } = useCustomTags();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('select-tag');
  const [selectedTag, setSelectedTag] = useState<CustomTag | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const operators: FilterOperator[] = ['is', 'is_not', 'is_any_of', 'is_none_of'];

  const reset = () => {
    setStep('select-tag');
    setSelectedTag(null);
    setSelectedOperator(null);
    setSelectedValues([]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(reset, 150);
    }
  };

  const handleSelectTag = (tag: CustomTag) => {
    setSelectedTag(tag);
    setStep('select-operator');
  };

  const handleSelectOperator = (operator: FilterOperator) => {
    setSelectedOperator(operator);
    setStep('select-values');
  };

  const handleToggleValue = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    if (selectedTag && selectedOperator && selectedValues.length > 0) {
      onAddFilter(
        selectedTag.key,
        selectedOperator,
        selectedValues.length === 1 ? selectedValues[0] : selectedValues
      );
      handleOpenChange(false);
    }
  };

  const handleBack = () => {
    if (step === 'select-values') {
      setStep('select-operator');
      setSelectedOperator(null);
      setSelectedValues([]);
    } else if (step === 'select-operator') {
      setStep('select-tag');
      setSelectedTag(null);
    }
  };

  const handleManageTagsClick = () => {
    handleOpenChange(false);
    onManageTags();
  };

  const canApply = selectedTag && selectedOperator && selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {step === 'select-tag' && (
          <SelectTagStep
            tags={allTags}
            onSelect={handleSelectTag}
            onManageTags={handleManageTagsClick}
          />
        )}
        
        {step === 'select-operator' && selectedTag && (
          <SelectOperatorStep
            tag={selectedTag}
            operators={operators}
            onSelect={handleSelectOperator}
            onBack={handleBack}
          />
        )}
        
        {step === 'select-values' && selectedTag && selectedOperator && (
          <SelectValuesStep
            tag={selectedTag}
            operator={selectedOperator}
            selectedValues={selectedValues}
            onToggleValue={handleToggleValue}
            onBack={handleBack}
            onApply={handleApply}
            canApply={!!canApply}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

interface SelectTagStepProps {
  tags: CustomTag[];
  onSelect: (tag: CustomTag) => void;
  onManageTags: () => void;
}

function SelectTagStep({ tags, onSelect, onManageTags }: SelectTagStepProps) {
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    if (!search) return tags;
    return tags.filter(t =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.key.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  return (
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
  );
}

interface SelectOperatorStepProps {
  tag: CustomTag;
  operators: FilterOperator[];
  onSelect: (operator: FilterOperator) => void;
  onBack: () => void;
}

function SelectOperatorStep({ tag, operators, onSelect, onBack }: SelectOperatorStepProps) {
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

interface SelectValuesStepProps {
  tag: CustomTag;
  operator: FilterOperator;
  selectedValues: string[];
  onToggleValue: (value: string) => void;
  onBack: () => void;
  onApply: () => void;
  canApply: boolean;
}

function SelectValuesStep({
  tag,
  operator,
  selectedValues,
  onToggleValue,
  onBack,
  onApply,
  canApply,
}: SelectValuesStepProps) {
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


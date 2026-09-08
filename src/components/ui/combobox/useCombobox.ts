import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export interface ComboboxOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  category?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface UseComboboxParams<T = string> {
  options: (ComboboxOption<T> | string)[];
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  allowCustomValue?: boolean;
  filterFn?: (option: ComboboxOption<T>, query: string) => boolean;
}

/**
 * useCombobox Hook
 * 
 * State machine orchestrator for autocomplete combobox.
 * Handles option normalization, filtering, keyboard navigation,
 * and outside click detection without cluttering the presentation layer.
 *
 * @hook
 * @layer UI Atom Hook
 * @module components/ui/combobox/useCombobox
 */
export function useCombobox<T = string>({
  options,
  value,
  onChange,
  disabled = false,
  allowCustomValue = true,
  filterFn,
}: UseComboboxParams<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Normalize options to structured ComboboxOption objects
  const normalizedOptions = useMemo<ComboboxOption<T>[]>(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return {
          value: opt as unknown as T,
          label: opt,
        };
      }
      return opt;
    });
  }, [options]);

  // Find current selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const [prevValue, setPrevValue] = useState(value);

  // Synchronize query when external value changes while closed
  if (prevValue !== value) {
    setPrevValue(value);
    if (!isOpen) {
      setQuery(selectedOption ? selectedOption.label : (value !== undefined && value !== null ? String(value) : ''));
    }
  }

  // Filter options based on user search
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions;
    if (filterFn) return normalizedOptions.filter((opt) => filterFn(opt, query));

    const q = query.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchSublabel = opt.sublabel?.toLowerCase().includes(q);
      const matchCategory = opt.category?.toLowerCase().includes(q);
      const matchBadge = opt.badge?.toLowerCase().includes(q);
      return matchLabel || matchSublabel || matchCategory || matchBadge;
    });
  }, [normalizedOptions, query, filterFn]);

  // Compute safe effective highlighted index
  const effectiveHighlightedIndex = (isOpen && filteredOptions.length > 0)
    ? (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length ? highlightedIndex : 0)
    : -1;

  // Ensure highlighted element is scrolled into view
  useEffect(() => {
    if (isOpen && effectiveHighlightedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[effectiveHighlightedIndex] as HTMLElement | undefined;
      if (activeElement && typeof activeElement.scrollIntoView === 'function') {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [effectiveHighlightedIndex, isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (selectedOption) {
          setQuery(selectedOption.label);
        } else if (value !== undefined && value !== null) {
          setQuery(String(value));
        } else {
          setQuery('');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDownOutside);
      document.addEventListener('touchstart', handlePointerDownOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isOpen, selectedOption, value]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (opt: ComboboxOption<T>) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setQuery(opt.label);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  // Handle custom value selection
  const handleSelectCustomValue = useCallback(() => {
    if (!query.trim()) return;
    onChange?.(query.trim() as unknown as T);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [query, onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen) {
          if (effectiveHighlightedIndex >= 0 && filteredOptions[effectiveHighlightedIndex]) {
            handleSelectOption(filteredOptions[effectiveHighlightedIndex]);
          } else if (allowCustomValue && query.trim()) {
            handleSelectCustomValue();
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        if (selectedOption) {
          setQuery(selectedOption.label);
        }
        break;

      case 'Tab':
        setIsOpen(false);
        break;

      default:
        break;
    }
  }, [disabled, isOpen, filteredOptions, effectiveHighlightedIndex, allowCustomValue, query, selectedOption, handleSelectOption, handleSelectCustomValue]);

  // Clear value handler
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('' as unknown as T);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  return {
    state: {
      isOpen,
      query,
      effectiveHighlightedIndex,
      filteredOptions,
      selectedOption,
    },
    actions: {
      setIsOpen,
      setQuery,
      setHighlightedIndex,
      handleSelectOption,
      handleSelectCustomValue,
      handleKeyDown,
      handleClear,
    },
    refs: {
      containerRef,
      inputRef,
      listRef,
    },
  };
}

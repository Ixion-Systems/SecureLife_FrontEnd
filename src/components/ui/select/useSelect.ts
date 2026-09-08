import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface UseSelectParams<T = string> {
  options: (SelectOption<T> | string)[];
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
}

/**
 * useSelect Hook
 * 
 * State machine orchestrator for custom dropdown select atom.
 * Encapsulates options normalization, highlight indices, outside click listeners,
 * and keyboard navigation (ArrowDown, ArrowUp, Enter, Esc).
 *
 * @hook
 * @layer UI Atom Hook
 * @module components/ui/select/useSelect
 */
export function useSelect<T = string>({
  options,
  value,
  onChange,
  disabled = false,
}: UseSelectParams<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Normalize options to structured SelectOption objects
  const normalizedOptions = useMemo<SelectOption<T>[]>(() => {
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

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Compute safe highlighted index
  const effectiveHighlightedIndex = useMemo(() => {
    if (!isOpen || normalizedOptions.length === 0) return -1;
    if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
      return highlightedIndex;
    }
    const selectedIdx = normalizedOptions.findIndex((opt) => opt.value === value);
    return selectedIdx >= 0 ? selectedIdx : 0;
  }, [isOpen, normalizedOptions, highlightedIndex, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && effectiveHighlightedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[effectiveHighlightedIndex] as HTMLElement | undefined;
      if (activeElement && typeof activeElement.scrollIntoView === 'function') {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [effectiveHighlightedIndex, isOpen]);

  // Close on click outside
  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
  }, [isOpen]);

  // Handle selection
  const handleSelect = useCallback(
    (opt: SelectOption<T>) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (normalizedOptions.length > 0) {
            setHighlightedIndex((prev) => (prev + 1) % normalizedOptions.length);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (normalizedOptions.length > 0) {
            setHighlightedIndex((prev) => (prev - 1 + normalizedOptions.length) % normalizedOptions.length);
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen) {
            if (effectiveHighlightedIndex >= 0 && normalizedOptions[effectiveHighlightedIndex]) {
              handleSelect(normalizedOptions[effectiveHighlightedIndex]);
            }
          } else {
            setIsOpen(true);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;

        case 'Tab':
          setIsOpen(false);
          break;

        default:
          break;
      }
    },
    [disabled, isOpen, normalizedOptions, effectiveHighlightedIndex, handleSelect]
  );

  return {
    state: {
      isOpen,
      normalizedOptions,
      selectedOption,
      effectiveHighlightedIndex,
    },
    actions: {
      setIsOpen,
      setHighlightedIndex,
      handleSelect,
      handleKeyDown,
    },
    refs: {
      containerRef,
      triggerRef,
      listRef,
    },
  };
}

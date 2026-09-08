import React, { useId } from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  useCombobox,
  type ComboboxOption,
} from './combobox/useCombobox';
import { ComboboxDropdown } from './combobox/ComboboxDropdown';

export type { ComboboxOption };
export type ComboboxVariant = 'primary' | 'glass' | 'white';

export interface ComboboxProps<T = string> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: (ComboboxOption<T> | string)[];
  variant?: ComboboxVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  defaultOptionIcon?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  containerClassName?: string;
  dropdownClassName?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  emptyMessage?: string;
  allowCustomValue?: boolean;
  emptyActionText?: string;
  filterFn?: (option: ComboboxOption<T>, query: string) => boolean;
  renderOption?: (option: ComboboxOption<T>, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  children?: React.ReactNode;
}

const COMBOBOX_VARIANTS: Record<ComboboxVariant, string> = {
  primary: 'bg-white/85 backdrop-blur-md border-white/80 focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20',
  glass: 'glass-surface border-white/70 focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20',
  white: 'bg-white border-gray-200 focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20',
};

/**
 * Combobox Component
 * 
 * High-performance, accessible combobox and autocomplete input built with SecureLife brand tokens.
 * Features an elegant, glassmorphic dropdown popup, keyboard navigation (ArrowUp, ArrowDown, Enter, Esc),
 * real-time query matching, custom value entry, and complete ARIA support.
 *
 * @component
 * @layer UI Atom / Molecule
 * @module components/ui/Combobox
 * 
 * @template T - Value type of options (default string).
 * @param {ComboboxProps<T>} props - Component properties.
 * @returns {React.ReactElement} Styled Combobox with custom animated pop-up.
 */
export function Combobox<T = string>({
  label,
  error,
  helperText,
  placeholder = 'Seleccioná o escribí...',
  value,
  onChange,
  options,
  variant = 'primary',
  leftIcon,
  rightIcon,
  defaultOptionIcon,
  width,
  height,
  className = '',
  containerClassName = '',
  dropdownClassName = '',
  required = false,
  disabled = false,
  id,
  name,
  emptyMessage,
  allowCustomValue = true,
  emptyActionText,
  filterFn,
  renderOption,
  children,
}: ComboboxProps<T>): React.ReactElement {
  const generatedId = useId();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const listboxId = `${inputId}-listbox`;

  const {
    state: { isOpen, query, effectiveHighlightedIndex, filteredOptions },
    actions: {
      setIsOpen,
      setQuery,
      setHighlightedIndex,
      handleSelectOption,
      handleSelectCustomValue,
      handleKeyDown,
      handleClear,
    },
    refs: { containerRef, inputRef, listRef },
  } = useCombobox<T>({
    options,
    value,
    onChange,
    disabled,
    allowCustomValue,
    filterFn,
  });

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={`relative flex flex-col gap-1.5 text-left ${isOpen ? 'z-30' : 'z-10'} ${containerClassName}`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="font-subtitle text-xs md:text-sm font-semibold text-[#0b1c30] tracking-wide flex items-center justify-between select-none"
        >
          <span>{label}</span>
          {required && <span className="text-[#22c55e] text-xs font-normal">* Requerido</span>}
        </label>
      )}

      {/* Input Field Surface */}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          error
            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200/50 bg-red-50/30'
            : `${COMBOBOX_VARIANTS[variant]} hover:border-gray-300 shadow-inner`
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
      >
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400 shrink-0">
            {leftIcon}
          </div>
        )}

        {/* Real Input Element */}
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-haspopup="listbox"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onClick={() => {
            if (!disabled) setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent px-4 py-2.5 text-sm font-body text-[#0b1c30] placeholder:text-gray-400 outline-none
            ${leftIcon ? 'pl-10' : ''}
            ${value || rightIcon ? 'pr-16' : 'pr-10'}
            ${className}`}
        />

        {/* Trailing Controls: Clear & Chevron Buttons */}
        <div className="absolute right-3 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Limpiar selección"
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {rightIcon ? (
            rightIcon
          ) : (
            <button
              type="button"
              tabIndex={-1}
              aria-label={isOpen ? 'Cerrar opciones' : 'Abrir opciones'}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  setIsOpen(!isOpen);
                  inputRef.current?.focus();
                }
              }}
              className="p-0.5 rounded-md hover:text-[#006e2f] transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#006e2f]' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Pop-up Dropdown Card */}
      {isOpen && (
        <ComboboxDropdown<T>
          listboxId={listboxId}
          listRef={listRef}
          filteredOptions={filteredOptions}
          value={value}
          effectiveHighlightedIndex={effectiveHighlightedIndex}
          query={query}
          emptyMessage={emptyMessage}
          emptyActionText={emptyActionText}
          allowCustomValue={allowCustomValue}
          defaultOptionIcon={defaultOptionIcon}
          dropdownClassName={dropdownClassName}
          renderOption={renderOption}
          onSelectOption={handleSelectOption}
          onSelectCustomValue={handleSelectCustomValue}
          onMouseEnterIndex={setHighlightedIndex}
        />
      )}

      {/* Extra slots or children */}
      {children}

      {/* Error or Helper Text */}
      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5 animate-slide-up flex items-center gap-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500 mt-0.5 font-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

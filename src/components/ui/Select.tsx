import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelect, type SelectOption } from './select/useSelect';
import { SelectDropdown } from './select/SelectDropdown';

export type { SelectOption };
export type SelectVariant = 'primary' | 'glass' | 'white';

export interface SelectProps<T = string> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: (SelectOption<T> | string)[];
  variant?: SelectVariant;
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
  renderOption?: (option: SelectOption<T>, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  renderSelected?: (option: SelectOption<T>) => React.ReactNode;
  children?: React.ReactNode;
}

const SELECT_VARIANTS: Record<SelectVariant, string> = {
  primary: 'bg-white/85 backdrop-blur-md border-white/80 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20',
  glass: 'glass-surface border-white/70 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20',
  white: 'bg-white border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20',
};

/**
 * Select Component
 * 
 * Accessible, customizable dropdown select atom built according to SecureLife brand design standards.
 * Employs a glassmorphic popover, keyboard navigation (ArrowDown, ArrowUp, Enter, Esc),
 * custom item icons, badges, selected indicator, and mobile-friendly touch targets.
 *
 * @component
 * @layer UI Atom
 * @module components/ui/Select
 * 
 * @template T - Value type of options (default string).
 * @param {SelectProps<T>} props - Component properties.
 * @returns {React.ReactElement} Styled select component with branded popover.
 */
export function Select<T = string>({
  label,
  error,
  helperText,
  placeholder = 'Seleccionar una opción...',
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
  renderOption,
  renderSelected,
  children,
}: SelectProps<T>): React.ReactElement {
  const generatedId = useId();
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const listboxId = `${selectId}-listbox`;

  const {
    state: { isOpen, normalizedOptions, selectedOption, effectiveHighlightedIndex },
    actions: { setIsOpen, setHighlightedIndex, handleSelect, handleKeyDown },
    refs: { containerRef, triggerRef, listRef },
  } = useSelect<T>({
    options,
    value,
    onChange,
    disabled,
  });

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={`relative flex flex-col gap-1.5 text-left ${isOpen ? 'z-30' : 'z-10'} ${containerClassName}`}
    >
      {/* Hidden input for standard form serialization */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value !== undefined && value !== null ? String(value) : ''}
        />
      )}

      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="font-subtitle text-xs md:text-sm font-semibold text-[#0b1c30] tracking-wide flex items-center justify-between select-none"
        >
          <span>{label}</span>
          {required && <span className="text-[#22c55e] text-xs font-normal">* Requerido</span>}
        </label>
      )}

      {/* Select Trigger Button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm font-body transition-all duration-200 outline-none border cursor-pointer select-none ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200/50 bg-red-50/30 text-[#0b1c30]'
            : `${SELECT_VARIANTS[variant]} hover:border-gray-300 shadow-inner`
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''} ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {leftIcon && (
            <div className="flex items-center text-gray-400 shrink-0">
              {leftIcon}
            </div>
          )}

          {selectedOption ? (
            renderSelected ? (
              renderSelected(selectedOption)
            ) : (
              <div className="flex items-center gap-2 truncate">
                {selectedOption.icon && (
                  <span className="shrink-0 text-[#006e2f]">{selectedOption.icon}</span>
                )}
                <span className="truncate font-semibold text-[#0b1c30]">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-subtitle font-medium bg-emerald-50 text-[#006e2f] border border-emerald-200/60">
                    {selectedOption.badge}
                  </span>
                )}
              </div>
            )
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center text-gray-400 shrink-0">
          {rightIcon ? (
            rightIcon
          ) : (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-[#006e2f]' : ''
              }`}
            />
          )}
        </div>
      </button>

      {/* Pop-up Dropdown */}
      {isOpen && (
        <SelectDropdown<T>
          listboxId={listboxId}
          listRef={listRef}
          normalizedOptions={normalizedOptions}
          value={value}
          effectiveHighlightedIndex={effectiveHighlightedIndex}
          defaultOptionIcon={defaultOptionIcon}
          dropdownClassName={dropdownClassName}
          renderOption={renderOption}
          onSelect={handleSelect}
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

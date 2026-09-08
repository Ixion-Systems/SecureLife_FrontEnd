import React from 'react';
import { Check } from 'lucide-react';
import type { SelectOption } from './useSelect';

export interface SelectDropdownProps<T = string> {
  listboxId: string;
  listRef: React.RefObject<HTMLUListElement | null>;
  normalizedOptions: SelectOption<T>[];
  value?: T;
  effectiveHighlightedIndex: number;
  defaultOptionIcon?: React.ReactNode;
  dropdownClassName?: string;
  renderOption?: (option: SelectOption<T>, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  onSelect: (opt: SelectOption<T>) => void;
  onMouseEnterIndex: (index: number) => void;
}

/**
 * SelectDropdown Component
 * 
 * Floating pop-up card displaying normalized selectable options,
 * badges, icons, selected indicators, and keyboard navigation shortcuts.
 *
 * @component
 * @layer UI Atom Subcomponent
 * @module components/ui/select/SelectDropdown
 */
export function SelectDropdown<T = string>({
  listboxId,
  listRef,
  normalizedOptions,
  value,
  effectiveHighlightedIndex,
  defaultOptionIcon,
  dropdownClassName = '',
  renderOption,
  onSelect,
  onMouseEnterIndex,
}: SelectDropdownProps<T>): React.ReactElement {
  return (
    <div
      id={listboxId}
      role="listbox"
      className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white border border-gray-200/90 shadow-[0_20px_45px_rgba(11,28,48,0.22),0_4px_12px_rgba(34,197,94,0.14)] overflow-hidden flex flex-col animate-popover ${dropdownClassName}`}
    >
      {/* Header Bar */}
      <div className="px-3.5 py-2 border-b border-gray-100/90 bg-gray-50/80 flex items-center justify-between text-[11px] font-subtitle text-gray-500 shrink-0">
        <span className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          {normalizedOptions.length} opciones disponibles
        </span>
        <span className="hidden sm:inline text-[10px] text-gray-400 font-normal">
          Selecciona una opción
        </span>
      </div>

      {/* Options List - Constrained to 3 items */}
      <ul
        ref={listRef}
        tabIndex={-1}
        className="max-h-[174px] overflow-y-auto custom-scrollbar p-1.5 space-y-1"
      >
        {normalizedOptions.map((opt, index) => {
          const isSelected = opt.value === value;
          const isHighlighted = index === effectiveHighlightedIndex;

          if (renderOption) {
            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(opt)}
                onMouseEnter={() => onMouseEnterIndex(index)}
                className="cursor-pointer"
              >
                {renderOption(opt, isSelected, isHighlighted)}
              </li>
            );
          }

          return (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(opt)}
              onMouseEnter={() => onMouseEnterIndex(index)}
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-[#22c55e]/15 text-[#006e2f] font-semibold border-l-3 border-[#22c55e]'
                  : isHighlighted
                  ? 'bg-[#22c55e]/10 text-[#006e2f]'
                  : 'hover:bg-gray-50 text-[#0b1c30]'
              } ${opt.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {/* Item Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#22c55e] text-white shadow-sm'
                      : isHighlighted
                      ? 'bg-[#22c55e]/20 text-[#006e2f]'
                      : 'bg-emerald-50/80 text-[#006e2f] group-hover:bg-[#22c55e]/15'
                  }`}
                >
                  {opt.icon ? opt.icon : defaultOptionIcon ? defaultOptionIcon : <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />}
                </div>

                {/* Text Details */}
                <div className="flex flex-col text-left truncate">
                  <span className="font-subtitle text-xs md:text-sm font-semibold truncate leading-tight">
                    {opt.label}
                  </span>
                  {opt.sublabel && (
                    <span className="font-body text-[11px] text-gray-500 truncate mt-0.5">
                      {opt.sublabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Badge & Selected Checkmark */}
              <div className="flex items-center gap-1.5 shrink-0">
                {opt.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-subtitle font-medium bg-gray-100 text-gray-600 border border-gray-200/60">
                    {opt.badge}
                  </span>
                )}
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#006e2f] stroke-[2.5]" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer Shortcuts */}
      <div className="px-3.5 py-1.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-body shrink-0">
        <span className="flex items-center gap-2">
          <span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">↑</kbd>{' '}
            <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">↓</kbd>{' '}
            Navegar
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">↵</kbd>{' '}
            Elegir
          </span>
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">Esc</kbd>{' '}
          Cerrar
        </span>
      </div>
    </div>
  );
}

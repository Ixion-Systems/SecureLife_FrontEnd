import React from 'react';
import { Search, Sparkles, Check } from 'lucide-react';
import type { ComboboxOption } from './useCombobox';

export interface ComboboxDropdownProps<T = string> {
  listboxId: string;
  listRef: React.RefObject<HTMLUListElement | null>;
  filteredOptions: ComboboxOption<T>[];
  value?: T;
  effectiveHighlightedIndex: number;
  query: string;
  emptyMessage?: string;
  emptyActionText?: string;
  allowCustomValue?: boolean;
  defaultOptionIcon?: React.ReactNode;
  dropdownClassName?: string;
  renderOption?: (option: ComboboxOption<T>, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  onSelectOption: (opt: ComboboxOption<T>) => void;
  onSelectCustomValue: () => void;
  onMouseEnterIndex: (index: number) => void;
}

/**
 * Helper to highlight matching substrings within option labels.
 */
function renderHighlightedText(text: string, highlight: string): React.ReactNode {
  if (!highlight.trim()) return text;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="text-[#006e2f] font-bold bg-[#22c55e]/15 px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

/**
 * ComboboxDropdown Component
 * 
 * Floating pop-up card displaying filtered options, keyboard shortcut indicators,
 * custom query action, and active state highlights.
 *
 * @component
 * @layer UI Atom Subcomponent
 * @module components/ui/combobox/ComboboxDropdown
 */
export function ComboboxDropdown<T = string>({
  listboxId,
  listRef,
  filteredOptions,
  value,
  effectiveHighlightedIndex,
  query,
  emptyMessage,
  emptyActionText,
  allowCustomValue = true,
  defaultOptionIcon,
  dropdownClassName = '',
  renderOption,
  onSelectOption,
  onSelectCustomValue,
  onMouseEnterIndex,
}: ComboboxDropdownProps<T>): React.ReactElement {
  return (
    <div
      id={listboxId}
      role="listbox"
      className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white border border-gray-200/90 shadow-[0_20px_45px_rgba(11,28,48,0.22),0_4px_12px_rgba(34,197,94,0.14)] overflow-hidden flex flex-col animate-popover ${dropdownClassName}`}
    >
      {/* Pop-up Header Bar */}
      <div className="px-3.5 py-2 border-b border-gray-100/90 bg-gray-50/80 flex items-center justify-between text-[11px] font-subtitle text-gray-500 shrink-0">
        <span className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          {filteredOptions.length > 0
            ? `${filteredOptions.length} opciones disponibles`
            : 'Sin coincidencias oficiales'}
        </span>
        <span className="hidden sm:inline text-[10px] text-gray-400 font-normal">
          Elegí o seguí escribiendo
        </span>
      </div>

      {/* Options List - Constrained to 3 items */}
      <ul
        ref={listRef}
        tabIndex={-1}
        className="max-h-[168px] overflow-y-auto custom-scrollbar p-1.5 space-y-1"
      >
        {filteredOptions.map((opt, index) => {
          const isSelected = opt.value === value;
          const isHighlighted = index === effectiveHighlightedIndex;

          if (renderOption) {
            return (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectOption(opt)}
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
              onClick={() => onSelectOption(opt)}
              onMouseEnter={() => onMouseEnterIndex(index)}
              className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none ${
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
                  {opt.icon ? opt.icon : defaultOptionIcon ? defaultOptionIcon : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Text Details */}
                <div className="flex flex-col text-left truncate">
                  <span className="font-subtitle text-xs md:text-sm font-semibold truncate leading-tight">
                    {renderHighlightedText(opt.label, query)}
                  </span>
                  {opt.sublabel && (
                    <span className="font-body text-[11px] text-gray-500 truncate mt-0.5">
                      {opt.sublabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges / Selected Checkmark */}
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

        {/* Empty State */}
        {filteredOptions.length === 0 && (
          <div className="p-4 text-center flex flex-col items-center justify-center gap-2 select-none">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#006e2f] flex items-center justify-center">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="font-subtitle text-xs font-bold text-[#0b1c30]">
                {emptyMessage || `No encontramos "${query}"`}
              </p>
              <p className="font-body text-[11px] text-gray-500 mt-0.5">
                No figura en el listado estándar oficial.
              </p>
            </div>

            {allowCustomValue && query.trim() && (
              <button
                type="button"
                onClick={onSelectCustomValue}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#006e2f] to-[#22c55e] hover:opacity-95 text-white font-subtitle text-xs font-semibold shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{emptyActionText || `Usar "${query}" personalizado`}</span>
              </button>
            )}
          </div>
        )}
      </ul>

      {/* Pop-up Footer with Keyboard Shortcuts */}
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

import React from 'react';
import { CheckCircle2, Check, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { CoberturaTipo } from '../types/cotizacion-auto.types';
import { COVERAGE_OPTIONS } from '../data/coberturaData';

export interface CoberturaCardListProps {
  selectedCobertura?: CoberturaTipo;
  onSelect: (tipo: CoberturaTipo) => void;
}

/**
 * CoberturaCardList Component
 * 
 * Interactive grid of selectable insurance coverage tiers (RC, Terceros, Todo Riesgo)
 * with badges, feature bullets, and active states.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/cotizador/components/CoberturaCardList
 * 
 * @param {CoberturaCardListProps} props - Component properties.
 * @returns {React.ReactElement} Grid of coverage tier cards.
 */
export const CoberturaCardList: React.FC<CoberturaCardListProps> = ({
  selectedCobertura,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COVERAGE_OPTIONS.map((opt) => {
        const isSelected = selectedCobertura === opt.tipo;

        return (
          <div
            key={opt.tipo}
            onClick={() => onSelect(opt.tipo)}
            className={`relative cursor-pointer rounded-2xl p-5 md:p-6 transition-all duration-300 text-left flex flex-col justify-between select-none ${
              isSelected
                ? 'bg-white/95 border-2 border-[#22c55e] shadow-xl shadow-[#22c55e]/15 scale-[1.02]'
                : 'glass-card hover:bg-white/90 border border-white/80 hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            {/* Popular Badge Top Floating */}
            {opt.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="primary"
                  className="shadow-sm font-subtitle text-[11px] uppercase tracking-wider font-bold bg-[#22c55e] text-[#004b1e] border-0 inline-flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-current" />
                  {opt.badge}
                </Badge>
              </div>
            )}

            <div>
              {/* Header Icon + Selection Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#22c55e] text-white shadow-sm'
                      : 'bg-emerald-50 text-[#006e2f]'
                  }`}
                >
                  {opt.icon}
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>

              {/* Card Title & Badge */}
              <h4 className="font-title text-base md:text-lg font-bold text-[#0b1c30]">
                {opt.title}
              </h4>
              {!opt.isPopular && (
                <Badge variant="secondary" className="mt-1 text-[10px] py-0.5 px-2">
                  {opt.badge}
                </Badge>
              )}

              <p className="font-body text-xs text-gray-600 mt-3 leading-relaxed">
                {opt.description}
              </p>

              {/* Feature Bullet Points */}
              <ul className="mt-4 space-y-2">
                {opt.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-body text-gray-700">
                    <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              <span
                className={`text-xs font-subtitle font-semibold block text-center ${
                  isSelected ? 'text-[#006e2f]' : 'text-gray-500'
                }`}
              >
                {isSelected ? 'Cobertura Seleccionada' : 'Seleccionar este plan'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

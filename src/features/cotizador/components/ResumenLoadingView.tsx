import React from 'react';
import { Sparkles } from 'lucide-react';

export interface ResumenLoadingViewProps {
  title?: string;
  subtitle?: string;
}

/**
 * ResumenLoadingView Component
 * 
 * Renders animated loading state while calculating insurance quote.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/cotizador/components/ResumenLoadingView
 * 
 * @param {ResumenLoadingViewProps} props - Component properties.
 * @returns {React.ReactElement} Loading spinner and message.
 */
export const ResumenLoadingView: React.FC<ResumenLoadingViewProps> = ({
  title = 'Calculando tu Cotización Personalizada...',
  subtitle = 'Analizando valores de mercado, scoring del vehículo y condiciones óptimas.',
}) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-slide-up">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 rounded-full border-4 border-[#22c55e]/20 border-t-[#22c55e] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[#006e2f]">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <div>
        <h3 className="font-title text-xl font-bold text-[#0b1c30]">
          {title}
        </h3>
        <p className="font-subtitle text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

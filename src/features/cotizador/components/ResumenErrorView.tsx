import React from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ResumenErrorViewProps {
  error?: string | null;
  onRetry: () => void;
  onReset: () => void;
}

/**
 * ResumenErrorView Component
 * 
 * Renders calculation failure state with error explanation and retry triggers.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/cotizador/components/ResumenErrorView
 * 
 * @param {ResumenErrorViewProps} props - Component properties.
 * @returns {React.ReactElement} Error presentation view.
 */
export const ResumenErrorView: React.FC<ResumenErrorViewProps> = ({
  error,
  onRetry,
  onReset,
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-slide-up">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <Info className="w-8 h-8" />
      </div>
      <h3 className="font-title text-xl font-bold text-[#0b1c30]">
        No pudimos calcular la cotización en este momento
      </h3>
      <p className="font-body text-sm text-gray-600 max-w-md">
        {error || 'Ocurrió un error inesperado al procesar los datos.'}
      </p>
      <div className="flex gap-3 pt-2">
        <Button variant="primary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Reintentar Cálculo
        </Button>
        <Button variant="outline" onClick={onReset}>
          Modificar Datos
        </Button>
      </div>
    </div>
  );
};

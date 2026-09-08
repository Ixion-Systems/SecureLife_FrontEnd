import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { CotizacionAutoFormData, ResultadoCotizacion } from '../types/cotizacion-auto.types';
import { formatCurrencyARS } from '../utils/calculoCotizacion';

export interface ResumenContratadoViewProps {
  formData: CotizacionAutoFormData;
  quote: ResultadoCotizacion;
  onClose: () => void;
}

/**
 * ResumenContratadoView Component (DEMO Mode)
 * 
 * Displays the simulated quotation summary and invites the user to log in or register
 * to legally emit and formalize the policy without processing phantom payments.
 *
 * @component
 * @layer Presentation / Feature Subcomponent
 * @module features/cotizador/components/ResumenContratadoView
 */
export const ResumenContratadoView: React.FC<ResumenContratadoViewProps> = ({
  formData,
  quote,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    try {
      sessionStorage.setItem(
        'securelife_pending_quote',
        JSON.stringify({ formData, quote, createdAt: new Date().toISOString() })
      );
    } catch {
      // Ignorar fallback
    }
    onClose();
    navigate('/login');
  };

  const handleGoToSignUp = () => {
    try {
      sessionStorage.setItem(
        'securelife_pending_quote',
        JSON.stringify({ formData, quote, createdAt: new Date().toISOString() })
      );
    } catch {
      // Ignorar fallback
    }
    onClose();
    navigate('/signup');
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-slide-up">
      <div className="w-16 h-16 rounded-2xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center border border-[#006e2f]/25 shadow-md">
        <ShieldCheck className="w-8 h-8 text-[#006e2f]" />
      </div>

      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-subtitle font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Simulador Demostrativo • Sin Cobros</span>
        </div>

        <h3 className="font-title text-2xl md:text-3xl font-black text-[#0b1c30]">
          ¡Tu cotización estimada está lista!
        </h3>

        <p className="font-body text-xs md:text-sm text-gray-600 leading-relaxed">
          Esta simulación no procesa pagos en la landing. Para formalizar la emisión legal de tu póliza,
          inspeccionar tu vehículo y activar tu cobertura oficial, inicia sesión o regístrate en SecureLife.
        </p>
      </div>

      <Card variant="white" className="p-5 rounded-2xl max-w-md w-full border-gray-200 text-left space-y-2.5 shadow-sm">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Titular del Seguro:</span>
          <span className="font-semibold text-[#0b1c30]">{formData.titular.nombreCompleto}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Vehículo:</span>
          <span className="font-semibold text-[#0b1c30]">
            {formData.vehiculo.marca} {formData.vehiculo.modelo} ({formData.vehiculo.anio})
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Patente:</span>
          <span className="font-mono font-bold text-[#0b1c30] uppercase">{formData.vehiculo.patente}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 pt-1 border-t border-gray-100">
          <span>Prima Mensual Estimada:</span>
          <span className="font-title font-bold text-base text-[#006e2f]">
            {formatCurrencyARS(quote.primaMensualEstimada)}
          </span>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center max-w-md">
        <Button
          variant="forest"
          size="md"
          glow
          onClick={handleGoToLogin}
          leftIcon={<LogIn className="w-4 h-4" />}
          className="w-full justify-center text-xs font-bold"
        >
          Iniciar Sesión para Contratar
        </Button>

        <Button
          variant="glass"
          size="md"
          onClick={handleGoToSignUp}
          leftIcon={<UserPlus className="w-4 h-4 text-[#006e2f]" />}
          className="w-full justify-center text-xs font-bold"
        >
          Crear Cuenta Nueva
        </Button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer pt-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a la página principal</span>
      </button>
    </div>
  );
};

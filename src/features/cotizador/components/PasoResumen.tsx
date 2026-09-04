import React, { useState } from 'react';
import {
  CheckCircle,
  FileCheck,
  Download,
  PhoneCall,
  RotateCcw,
  Sparkles,
  Info,
  Car,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type {
  CotizacionAutoFormData,
  AsyncCotizacionState,
} from '../types/cotizacion-auto.types';
import {
  formatCurrencyARS,
  COBERTURA_LABELS,
} from '../utils/calculoCotizacion';

export interface PasoResumenProps {
  formData: CotizacionAutoFormData;
  asyncState: AsyncCotizacionState;
  onRetry: () => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * PasoResumen Component
 * 
 * Step 4 of the Auto Insurance Quoting Wizard.
 * Presents the calculated quote with financial breakdown, insured sum,
 * deductible (if applicable), monthly premium, and final action buttons.
 *
 * @component
 * @layer Presentation / Feature Component
 * @module features/cotizador/components/PasoResumen
 * 
 * @param {PasoResumenProps} props - Component properties.
 * @returns {React.ReactElement} Form step view with quote breakdown.
 */
export const PasoResumen: React.FC<PasoResumenProps> = ({
  formData,
  asyncState,
  onRetry,
  onReset,
  onClose,
}) => {
  const [contratado, setContratado] = useState(false);

  // 1. Loading State
  if (asyncState.status === 'loading') {
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
            Calculando tu Cotización Personalizada...
          </h3>
          <p className="font-subtitle text-sm text-gray-500 mt-1">
            Analizando valores de mercado, scoring del vehículo y condiciones óptimas.
          </p>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (asyncState.status === 'error') {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="font-title text-xl font-bold text-[#0b1c30]">
          No pudimos calcular la cotización en este momento
        </h3>
        <p className="font-body text-sm text-gray-600 max-w-md">
          {asyncState.error || 'Ocurrió un error inesperado al procesar los datos.'}
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
  }

  const quote = asyncState.data;
  if (!quote) return null;

  const coberturaInfo =
    (quote.cobertura && COBERTURA_LABELS[quote.cobertura]) || {
      title: 'Cobertura Personalizada',
      desc: 'Protección a medida para tu vehículo',
      badge: 'Recomendado',
    };

  // 3. Success State: Contract Confirmed
  if (contratado) {
    return (
      <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 text-[#006e2f] flex items-center justify-center border-2 border-[#22c55e] shadow-lg shadow-[#22c55e]/25">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div>
          <Badge variant="primary" className="mb-2">
            Póliza Emitida con Éxito
          </Badge>
          <h3 className="font-title text-2xl md:text-3xl font-bold text-[#0b1c30]">
            ¡Felicitaciones, {formData.titular.nombreCompleto}!
          </h3>
          <p className="font-subtitle text-sm md:text-base text-gray-600 max-w-lg mt-2">
            Hemos registrado tu solicitud con número <strong className="text-[#006e2f]">{quote.id}</strong>.
            Enviamos el certificado de cobertura provisorio y los cupones de pago a <strong>{formData.titular.email}</strong>.
          </p>
        </div>

        <Card variant="white" className="p-4 rounded-2xl max-w-md w-full border-gray-200 text-left space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Vehículo:</span>
            <span className="font-semibold text-[#0b1c30]">{formData.vehiculo.marca} {formData.vehiculo.modelo} ({formData.vehiculo.anio})</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Patente:</span>
            <span className="font-mono font-bold text-[#0b1c30] uppercase">{formData.vehiculo.patente}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Prima Mensual:</span>
            <span className="font-bold text-[#006e2f]">{formatCurrencyARS(quote.primaMensualEstimada)}</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center">
          <Button
            variant="primary"
            onClick={onClose}
            rightIcon={<FileCheck className="w-4 h-4" />}
          >
            Finalizar y Volver al Sitio
          </Button>
          <Button
            variant="glass"
            onClick={() => alert(`Descargando póliza oficial #${quote.id} en formato PDF...`)}
            leftIcon={<Download className="w-4 h-4 text-[#006e2f]" />}
          >
            Descargar Póliza (PDF)
          </Button>
        </div>
      </div>
    );
  }

  // 4. Normal Step 4: Full Breakdown View
  return (
    <div className="space-y-6 animate-slide-up text-left">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-title text-xl md:text-2xl font-bold text-[#0b1c30]">
              Resumen de tu Cotización
            </h3>
            <Badge variant="primary" className="text-[11px] py-0.5">
              Cotización #{quote.id}
            </Badge>
          </div>
          <p className="font-subtitle text-xs md:text-sm text-gray-600 mt-0.5">
            Valores estimados basados en el perfil del conductor y scoring del rodado.
          </p>
        </div>

        {quote.origen === 'fallback_local' && (
          <span className="text-[11px] text-gray-400 font-mono self-start sm:self-auto bg-gray-100 px-2 py-0.5 rounded-full">
            ● Motor de cálculo en vivo
          </span>
        )}
      </div>

      {/* Main Highlights Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prima Mensual Grande */}
        <div className="md:col-span-1 rounded-2xl p-6 bg-gradient-to-br from-[#005321] to-[#006e2f] text-white shadow-xl shadow-[#006e2f]/20 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-subtitle font-bold text-emerald-300 tracking-wider">
              Cuota Mensual Estimada
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-title text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatCurrencyARS(quote.primaMensualEstimada)}
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1 font-body">
              Precio final por mes con IVA incluido
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-400/30 text-xs text-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Sin costos ocultos ni cláusulas sorpresivas</span>
          </div>
        </div>

        {/* Suma Asegurada & Franquicia */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="glass-card" className="p-5 flex flex-col justify-between rounded-2xl border-white/90">
            <div>
              <span className="text-xs font-subtitle font-semibold text-gray-500 uppercase tracking-wider">
                Suma Asegurada del Vehículo
              </span>
              <p className="font-title text-2xl font-bold text-[#0b1c30] mt-1">
                {formatCurrencyARS(quote.sumaAsegurada)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Valor estimado del automotor en plaza según modelo y año.
              </p>
            </div>
            <Badge variant="secondary" className="mt-3 text-[11px] self-start">
              Cobertura 100% Reposición
            </Badge>
          </Card>

          <Card variant="glass-card" className="p-5 flex flex-col justify-between rounded-2xl border-white/90">
            <div>
              <span className="text-xs font-subtitle font-semibold text-gray-500 uppercase tracking-wider">
                Franquicia por Accidente
              </span>
              <p className="font-title text-2xl font-bold text-[#0b1c30] mt-1">
                {quote.franquicia ? formatCurrencyARS(quote.franquicia) : 'Sin Franquicia'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {quote.franquicia
                  ? 'Monto fijo a cargo del asegurado en siniestros con culpa.'
                  : 'Cero deducible en robo, incendio o daños cubiertos.'}
              </p>
            </div>
            <Badge
              variant={quote.franquicia ? 'secondary' : 'primary'}
              className="mt-3 text-[11px] self-start"
            >
              {quote.franquicia ? 'Franquicia Fija' : 'Cobertura Total'}
            </Badge>
          </Card>
        </div>
      </div>

      {/* Details Grid: Titular, Vehículo & Desglose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Insured & Car Summary */}
        <Card variant="white" className="p-5 rounded-2xl border-gray-200/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <User className="w-4 h-4 text-[#006e2f]" />
            <h4 className="font-subtitle font-bold text-sm text-[#0b1c30]">
              Datos del Titular y Vehículo
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Titular:</span>
              <span className="font-medium text-[#0b1c30]">{formData.titular.nombreCompleto}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">DNI:</span>
              <span className="font-mono text-[#0b1c30]">{formData.titular.dni}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Email:</span>
              <span className="text-[#0b1c30]">{formData.titular.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Vehículo:</span>
              <span className="font-semibold text-[#0b1c30] flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-gray-400" />
                {formData.vehiculo.marca} {formData.vehiculo.modelo} ({formData.vehiculo.anio})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Patente:</span>
              <span className="font-mono font-bold uppercase text-[#0b1c30]">{formData.vehiculo.patente}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Plan Seleccionado:</span>
              <span className="font-bold text-[#006e2f]">{coberturaInfo.title}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Equipo de GNC:</span>
              <span className="font-medium text-[#0b1c30]">{formData.vehiculo.tieneGnc ? 'Sí' : 'No'}</span>
            </div>
          </div>
        </Card>

        {/* Financial Breakdown */}
        <Card variant="white" className="p-5 rounded-2xl border-gray-200/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <FileCheck className="w-4 h-4 text-[#006e2f]" />
            <h4 className="font-subtitle font-bold text-sm text-[#0b1c30]">
              Desglose Técnico de la Prima
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-600">Premio Técnico Base:</span>
              <span className="font-mono font-semibold text-[#0b1c30]">
                {formatCurrencyARS(quote.desglose?.premioBase ?? 0)}
              </span>
            </div>

            {quote.desglose?.recargoGnc ? quote.desglose.recargoGnc > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-50 text-amber-700">
                <span>Recargo por equipo GNC:</span>
                <span className="font-mono">+{formatCurrencyARS(quote.desglose.recargoGnc)}</span>
              </div>
            ) : null}

            {quote.desglose?.ajusteKilometraje && quote.desglose.ajusteKilometraje !== 0 ? (
              <div
                className={`flex justify-between py-1 border-b border-gray-50 ${
                  quote.desglose.ajusteKilometraje < 0 ? 'text-emerald-700 font-semibold' : 'text-gray-600'
                }`}
              >
                <span>Ajuste por Kilometraje Anual:</span>
                <span className="font-mono">
                  {quote.desglose.ajusteKilometraje > 0 ? '+' : ''}
                  {formatCurrencyARS(quote.desglose.ajusteKilometraje)}
                </span>
              </div>
            ) : null}

            {quote.desglose?.recargoConductores && quote.desglose.recargoConductores > 0 ? (
              <div className="flex justify-between py-1 border-b border-gray-50 text-gray-700">
                <span>Conductores Adicionales ({formData.conductoresAdicionales.length}):</span>
                <span className="font-mono">+{formatCurrencyARS(quote.desglose.recargoConductores)}</span>
              </div>
            ) : null}

            <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
              <span>Impuestos, Tasas SSN e IVA (21%):</span>
              <span className="font-mono text-[#0b1c30]">
                {formatCurrencyARS(quote.desglose?.impuestos ?? 0)}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-sm font-bold text-[#006e2f]">
              <span>Total Mensual:</span>
              <span className="font-title text-base">{formatCurrencyARS(quote.primaMensualEstimada ?? 0)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Triggers */}
      <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-end items-center">
        <Button
          type="button"
          variant="glass"
          onClick={() => alert(`Un productor de seguros de SecureLife se comunicará con ${formData.titular.telefono} a la brevedad.`)}
          leftIcon={<PhoneCall className="w-4 h-4 text-[#006e2f]" />}
          className="w-full sm:w-auto text-xs"
        >
          Solicitar Llamada de Asesor
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          glow
          onClick={() => setContratado(true)}
          rightIcon={<FileCheck className="w-5 h-5" />}
          className="w-full sm:w-auto shadow-lg shadow-[#22c55e]/25 text-sm font-bold"
        >
          Contratar Póliza Inmediata
        </Button>
      </div>
    </div>
  );
};

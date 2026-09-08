import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionVidaFormData,
  CalculoVidaResultado,
  AsyncRadicacionVidaState,
} from '../types/cotizacion-vida.types';

export interface Paso4ResumenRadicacionProps {
  formData: CotizacionVidaFormData;
  calculo: CalculoVidaResultado | null;
  asyncRadicacion: AsyncRadicacionVidaState;
  onRadicar: () => void;
  onCerrarYVolver: () => void;
}

export const Paso4ResumenRadicacion: React.FC<Paso4ResumenRadicacionProps> = ({
  formData,
  calculo,
  asyncRadicacion,
  onRadicar,
  onCerrarYVolver,
}) => {
  const isSuccess = asyncRadicacion.status === 'success';
  const resultado = isSuccess ? asyncRadicacion.data : null;

  const desglose = calculo?.desglose;
  const primaFinal = calculo?.primaMensualEstimada || 0;
  const capital = formData.capitalAsegurado || 25_000_000;

  const formatearMonto = (m: number) => `$${m.toLocaleString('es-AR')}`;

  if (isSuccess && resultado) {
    return (
      <div className="space-y-6 text-center animate-scale-in py-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#006e2f] flex items-center justify-center mx-auto border border-emerald-300 shadow-lg shadow-emerald-900/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <Badge variant="primary" className="text-xs px-3 py-1 font-bold">
            Radicación Oficial Completada
          </Badge>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-[#0b1c30]">
            ¡Póliza de Seguro de Vida en Evaluación!
          </h2>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            Tu expediente digital ha sido radicado exitosamente en los sistemas de suscripción de
            SecureLife. Nuestro equipo actuarial y médico confirmará la emisión definitiva.
          </p>
        </div>

        {/* Resumen del expediente radicado */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-gray-200/90 shadow-sm text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Expediente N°:</span>
            <strong className="font-title text-[#006e2f]">{resultado.numeroCotizacion}</strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Estado Oficial:</span>
            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
              {resultado.estado}
            </Badge>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Capital Asegurado:</span>
            <strong className="font-title text-[#0b1c30]">
              {formatearMonto(resultado.capitalAsegurado)} ARS
            </strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Prima Mensual Pactada:</span>
            <strong className="font-title text-base text-[#006e2f]">
              {formatearMonto(resultado.primaMensualFinal)} /mes
            </strong>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Beneficiarios Designados:</span>
            <strong className="font-title text-[#0b1c30]">
              {resultado.beneficiarios.length} titulares
            </strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onCerrarYVolver}
            className="w-full sm:w-auto !rounded-xl"
          >
            Volver al Dashboard Principal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Resumen */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 4: Resumen Actuarial y Contratación Digital
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            Revisa el desglose técnico de tu prima mensual, las condiciones de suscripción y confirma
            la radicación digital con firma electrónica vinculante.
          </p>
        </div>
      </div>

      {/* Grid: Desglose Actuarial vs Beneficiarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Desglose Actuarial */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#006e2f]" />
              Desglose Técnico de Prima
            </h4>
            <Badge variant="glass" className="text-[10px]">
              Tarifa Regulada SSN
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Capital Asegurado:</span>
              <strong className="text-[#0b1c30]">{formatearMonto(capital)} ARS</strong>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Prima Técnica Base:</span>
              <span>{formatearMonto(desglose?.primaBase || 0)}</span>
            </div>

            {desglose?.recargoEdad ? (
              <div className="flex justify-between text-amber-700">
                <span>Recargo Etario ({formData.edad} años):</span>
                <span>+{formatearMonto(desglose.recargoEdad)}</span>
              </div>
            ) : null}

            {desglose?.recargoTabaquismo ? (
              <div className="flex justify-between text-amber-700">
                <span>Recargo Fumador Habitual (+35%):</span>
                <span>+{formatearMonto(desglose.recargoTabaquismo)}</span>
              </div>
            ) : null}

            {desglose?.recargoDeportes ? (
              <div className="flex justify-between text-amber-700">
                <span>Recargo Deportes Extremos (+25%):</span>
                <span>+{formatearMonto(desglose.recargoDeportes)}</span>
              </div>
            ) : null}

            {desglose?.recargoPreexistencias ? (
              <div className="flex justify-between text-amber-700">
                <span>Recargo Salud / Preexistencias:</span>
                <span>+{formatearMonto(desglose.recargoPreexistencias)}</span>
              </div>
            ) : null}

            {desglose?.descuentoVolumenCapital ? (
              <div className="flex justify-between text-[#006e2f] font-semibold">
                <span>Bonificación por Gran Capital:</span>
                <span>-{formatearMonto(desglose.descuentoVolumenCapital)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100">
              <span>Sellados e Impuestos (19%):</span>
              <span>{formatearMonto(desglose?.impuestosYSellados || 0)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block leading-tight">
                Total Prima Mensual
              </span>
              <span className="text-[10px] text-gray-400">Débito automático mensual</span>
            </div>
            <div className="text-right">
              <span className="font-title text-2xl font-extrabold text-[#006e2f]">
                {formatearMonto(primaFinal)}
              </span>
              <span className="text-xs text-gray-500 font-semibold block">/mes ARS</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Beneficiarios y Cobertura */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#006e2f]" />
                Beneficiarios Asignados (100%)
              </h4>
              <Badge variant="primary" className="text-[10px]">
                {formData.beneficiarios.length} Designados
              </Badge>
            </div>

            <div className="space-y-2 mt-3 max-h-48 overflow-y-auto pr-1">
              {formData.beneficiarios.map((b, idx) => {
                const montoBeneficiario = Math.round((capital * Number(b.porcentaje)) / 100);
                return (
                  <div
                    key={b.id || idx}
                    className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-200/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#0b1c30] block">{b.nombreCompleto}</strong>
                      <span className="text-[11px] text-gray-500">
                        DNI {b.dni} • {b.parentesco}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#006e2f]">{b.porcentaje}%</span>
                      <span className="block text-[10px] text-gray-500">
                        {formatearMonto(montoBeneficiario)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-[11px] text-emerald-900 mt-2">
            La indemnización no tributa impuesto a las ganancias ni entra en juicio sucesorio
            (Disponibilidad inmediata en 48 hs).
          </div>
        </div>
      </div>

      {/* Términos y Declaración Jurada */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.aceptaTerminos}
            readOnly
            className="mt-0.5 rounded text-[#006e2f] focus:ring-[#006e2f]"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            Declaro bajo juramento que los datos de salud, hábitos, edad y ocupación declarados son
            exactos y verídicos. Acepto las cláusulas de contratación digital y autorizo la emisión
            de la póliza en conformidad con la Superintendencia de Seguros de la Nación (SSN).
          </span>
        </label>
      </div>

      {/* Error de radicación si hubo */}
      {asyncRadicacion.status === 'error' && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{asyncRadicacion.error}</span>
        </div>
      )}

      {/* Botón de Radicación */}
      <div className="pt-2 flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="lg"
          glow
          onClick={onRadicar}
          isLoading={asyncRadicacion.status === 'submitting'}
          disabled={asyncRadicacion.status === 'submitting'}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto !rounded-2xl !px-8"
        >
          {asyncRadicacion.status === 'submitting'
            ? 'Radicando en el Registro Oficial...'
            : 'Confirmar y Contratar Seguro de Vida'}
        </Button>
      </div>
    </div>
  );
};

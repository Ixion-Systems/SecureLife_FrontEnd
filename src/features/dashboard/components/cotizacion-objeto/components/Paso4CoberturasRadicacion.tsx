import React from 'react';
import type { FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Info,
  Droplets,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  CotizacionObjetoFormData,
  CalculoObjetoResultado,
  AsyncRadicacionObjetoState,
} from '../types/cotizacion-objeto.types';

export interface Paso4CoberturasRadicacionProps {
  errors: FieldErrors<CotizacionObjetoFormData>;
  watch: UseFormWatch<CotizacionObjetoFormData>;
  setValue: UseFormSetValue<CotizacionObjetoFormData>;
  calculo: CalculoObjetoResultado | null;
  asyncRadicacion: AsyncRadicacionObjetoState;
  onRadicar: () => void;
  onCerrarYVolver: () => void;
}

export const Paso4CoberturasRadicacion: React.FC<Paso4CoberturasRadicacionProps> = ({
  errors,
  watch,
  setValue,
  calculo,
  asyncRadicacion,
  onRadicar,
  onCerrarYVolver,
}) => {
  const isSuccess = asyncRadicacion.status === 'success';
  const resultado = isSuccess ? asyncRadicacion.data : null;

  const cubreRobo = watch('cubreRoboExpress');
  const cubreAccidente = watch('cubreDanoAccidental');
  const cubreLiquidos = watch('cubreDerrameLiquidos');
  const aceptaTerminos = watch('aceptaTerminos');

  const desglose = calculo?.desglose;
  const primaFinal = calculo?.primaMensualEstimada || 0;
  const franquicia = calculo?.franquiciaFija || 0;
  const valorAsegurado = calculo?.valorAsegurado || 1_200_000;

  const formatearMonto = (m: number) => `$${m.toLocaleString('es-AR')}`;

  if (isSuccess && resultado) {
    return (
      <div className="space-y-6 text-center animate-scale-in py-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#006e2f] flex items-center justify-center mx-auto border border-emerald-300 shadow-lg shadow-emerald-900/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <Badge variant="primary" className="text-xs px-3 py-1 font-bold">
            Radicación Oficial Exitosa
          </Badge>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-[#0b1c30]">
            ¡Póliza de Tecnología en Proceso de Emisión!
          </h2>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            Tu solicitud para {resultado.bienAsegurado.marca} {resultado.bienAsegurado.modelo} ha sido
            registrada en nuestro libro oficial. La mesa pericial validará el IMEI/Número de Serie en 24 hs.
          </p>
        </div>

        {/* Resumen del expediente radicado */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-gray-200/90 shadow-sm text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Expediente N°:</span>
            <strong className="font-title text-[#006e2f]">{resultado.numeroCotizacion}</strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Dispositivo:</span>
            <strong className="font-title text-[#0b1c30]">
              {resultado.bienAsegurado.marca} {resultado.bienAsegurado.modelo}
            </strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">IMEI / N° Serie:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
              {resultado.bienAsegurado.identificador}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Suma Asegurada:</span>
            <strong className="font-title text-[#0b1c30]">
              {formatearMonto(resultado.valorAsegurado)} ARS
            </strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Franquicia Pactada (10%):</span>
            <span className="font-bold text-amber-700">
              {formatearMonto(resultado.franquiciaFija)} ARS
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Prima Mensual:</span>
            <strong className="font-title text-base text-[#006e2f]">
              {formatearMonto(resultado.primaMensualFinal)} /mes
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
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner de Coberturas */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-title text-sm font-bold text-[#0b1c30]">
            Paso 4: Paquetes de Cobertura, Franquicia y Contratación
          </h3>
          <p className="font-body text-xs text-gray-600 mt-0.5 leading-relaxed">
            Personaliza los riesgos amparados, comprende la franquicia fija del 10% y confirma la
            suscripción con tarifa oficial.
          </p>
        </div>
      </div>

      {/* Selector de Paquetes de Cobertura */}
      <div className="space-y-3">
        <h4 className="font-title text-sm font-bold text-[#0b1c30]">
          Riesgos Amparados en tu Póliza
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Robo Express */}
          <div
            onClick={() => setValue('cubreRoboExpress', !cubreRobo, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              cubreRobo
                ? 'bg-amber-50/40 border-amber-500 ring-1 ring-amber-500/20 shadow-xs'
                : 'bg-white border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <input
                  type="checkbox"
                  checked={cubreRobo}
                  readOnly
                  className="rounded text-[#006e2f]"
                />
              </div>
              <h5 className="font-title text-xs font-bold text-[#0b1c30] mt-2">
                Robo Express y Arrebato
              </h5>
              <p className="font-body text-[11px] text-gray-500 mt-1">
                Robo violento en la calle, transporte público o lugares cerrados en todo el mundo.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-2 block">
              {cubreRobo ? '✓ Incluido' : '+ Agregar'}
            </span>
          </div>

          {/* 2. Daño Total por Accidente */}
          <div
            onClick={() => setValue('cubreDanoAccidental', !cubreAccidente, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              cubreAccidente
                ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                : 'bg-white border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <input
                  type="checkbox"
                  checked={cubreAccidente}
                  readOnly
                  className="rounded text-[#006e2f]"
                />
              </div>
              <h5 className="font-title text-xs font-bold text-[#0b1c30] mt-2">
                Daño Accidental / Caídas
              </h5>
              <p className="font-body text-[11px] text-gray-500 mt-1">
                Rotura de display, pantalla o estructura por caída involuntaria o impacto severo.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-800 mt-2 block">
              {cubreAccidente ? '✓ Incluido' : '+ Agregar'}
            </span>
          </div>

          {/* 3. Derrame de Líquidos */}
          <div
            onClick={() => setValue('cubreDerrameLiquidos', !cubreLiquidos, { shouldValidate: true })}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              cubreLiquidos
                ? 'bg-purple-50/40 border-purple-500 ring-1 ring-purple-500/20 shadow-xs'
                : 'bg-white border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <input
                  type="checkbox"
                  checked={cubreLiquidos}
                  readOnly
                  className="rounded text-[#006e2f]"
                />
              </div>
              <h5 className="font-title text-xs font-bold text-[#0b1c30] mt-2">
                Derrame de Líquidos
              </h5>
              <p className="font-body text-[11px] text-gray-500 mt-1">
                Sulfatación o cortocircuito accidental por contacto o inmersión con agua/café.
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-800 mt-2 block">
              {cubreLiquidos ? '✓ Incluido' : '+ Agregar'}
            </span>
          </div>
        </div>
      </div>

      {/* Destacado de Franquicia Fija del 10% y Desglose de Prima */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Franquicia Fija 10% */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006e2f]" />
              Franquicia Fija del 10%
            </h4>
            <Badge variant="primary" className="text-[10px] font-bold">
              10% Fija
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Valor Tasado del Dispositivo:</span>
              <strong className="text-[#0b1c30]">{formatearMonto(valorAsegurado)} ARS</strong>
            </div>
            <div className="flex justify-between text-amber-800 font-semibold">
              <span>Monto de Franquicia a cargo del cliente:</span>
              <span>{formatearMonto(franquicia)} ARS</span>
            </div>
            <div className="flex justify-between text-[#006e2f] font-bold">
              <span>Indemnización Neta Asegurada:</span>
              <span>{formatearMonto(valorAsegurado - franquicia)} ARS</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-900 mt-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              En caso de siniestro total, la aseguradora te repone el equipo o abona el 90% del valor
              asegurado, deduciendo únicamente la franquicia pactada del 10%.
            </span>
          </div>
        </div>

        {/* Desglose de Prima Mensual */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-title text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#006e2f]" />
                Cálculo Actuarial de Prima
              </h4>
              <Badge variant="glass" className="text-[10px]">
                {desglose?.tasaBasePct || 2.4}% Anual
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              <div className="flex justify-between text-gray-600">
                <span>Prima Base Robo Express:</span>
                <span>{formatearMonto(desglose?.primaRoboExpress || 0)}</span>
              </div>
              {cubreAccidente && (
                <div className="flex justify-between text-gray-600">
                  <span>Adicional Daño Accidental:</span>
                  <span>+{formatearMonto(desglose?.primaDanoAccidental || 0)}</span>
                </div>
              )}
              {cubreLiquidos && (
                <div className="flex justify-between text-gray-600">
                  <span>Adicional Derrame de Líquidos:</span>
                  <span>+{formatearMonto(desglose?.primaDerrameLiquidos || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100">
                <span>Impuestos y Tasa SSN (19%):</span>
                <span>{formatearMonto(desglose?.impuestosYSellados || 0)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block leading-tight">
                Cuota Mensual Final
              </span>
              <span className="text-[10px] text-gray-400">Sin permanencia mínima</span>
            </div>
            <div className="text-right">
              <span className="font-title text-2xl font-extrabold text-[#006e2f]">
                {formatearMonto(primaFinal)}
              </span>
              <span className="text-xs text-gray-500 font-semibold block">/mes ARS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            readOnly
            className="mt-0.5 rounded text-[#006e2f] focus:ring-[#006e2f]"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            Acepto los términos de cobertura de tecnología y objetos personales, con franquicia fija
            del 10%, y certifico que el número de serie o IMEI y fotografías adjuntas corresponden al
            bien asegurado bajo apercibimiento de nulidad.
          </span>
        </label>
        {errors.aceptaTerminos?.message && (
          <p className="text-xs text-red-500">{errors.aceptaTerminos.message}</p>
        )}
      </div>

      {/* Error de radicación */}
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
            ? 'Radicando en el Registro de Tecnología...'
            : 'Confirmar y Contratar Seguro'}
        </Button>
      </div>
    </div>
  );
};

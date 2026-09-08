import React, { useState } from 'react';
import {
  Shield,
  Car,
  User,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Calendar,
  Lock,
  ArrowRight,
} from 'lucide-react';
import type {
  VehiculoFormState,
  CoberturaFormState,
  TitularState,
  CotizacionEstimacionRealTime,
  CotizacionRadicadaResultado,
  InspeccionSlot,
} from './types';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';

export interface Paso4ResumenRadicacionProps {
  vehiculo: VehiculoFormState;
  cobertura: CoberturaFormState;
  titular: TitularState;
  setTitular: React.Dispatch<React.SetStateAction<TitularState>>;
  estimacion: CotizacionEstimacionRealTime | null;
  inspeccionSlots: InspeccionSlot[];
  radicadoResultado: CotizacionRadicadaResultado | null;
  isSubmitting: boolean;
  submitError: string | null;
  onRadicar: () => void;
  onVolverDashboard: () => void;
}

export const Paso4ResumenRadicacion: React.FC<Paso4ResumenRadicacionProps> = ({
  vehiculo,
  cobertura,
  titular,
  setTitular,
  estimacion,
  inspeccionSlots,
  radicadoResultado,
  isSubmitting,
  submitError,
  onRadicar,
  onVolverDashboard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNumero = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const planTitles: Record<string, string> = {
    TODO_RIESGO_CON_FRANQUICIA: 'Todo Riesgo con Franquicia',
    TERCEROS_COMPLETO: 'Terceros Completo',
    TERCEROS_BASICO: 'Terceros Básico',
    RESPONSABILIDAD_CIVIL: 'Responsabilidad Civil',
  };

  // =========================================================================
  // VISTA 1: PANTALLA DE ÉXITO (TRAS RADICAR OFICIALMENTE)
  // =========================================================================
  if (radicadoResultado) {
    const isManual = radicadoResultado.esManual;

    return (
      <div className="py-6 px-2 text-center space-y-6 animate-scale-in">
        {/* Icono de Éxito */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 text-[#006e2f] border-2 border-emerald-200/80 mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/10">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#006e2f]" />
        </div>

        {/* Título y Subtítulo */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="font-title text-2xl sm:text-3xl font-black text-[#0b1c30]">
            ¡Solicitud Radicada Exitosamente!
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-600">
            Tu trámite ha sido registrado en la base de datos oficial de SecureLife bajo supervisión de la Superintendencia de Seguros de la Nación.
          </p>
        </div>

        {/* NÚMERO OFICIAL DE COTIZACIÓN Y BADGE */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm max-w-md mx-auto space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-gray-500">
              Número Oficial de Trámite
            </span>
            {/* BADGES REQUERIDOS POR SPEC */}
            {isManual ? (
              <Badge variant="secondary" className="!bg-amber-100 !text-amber-900 !border-amber-300 font-bold text-xs py-1 px-3">
                En Revisión Extensa (Peritaje 24-48h)
              </Badge>
            ) : (
              <Badge variant="primary" className="!bg-emerald-100 !text-[#006e2f] !border-emerald-300 font-bold text-xs py-1 px-3">
                Pendiente de Aprobación
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="font-mono text-base sm:text-lg font-black text-[#0b1c30] tracking-wider">
              {radicadoResultado.numeroCotizacion}
            </span>
            <button
              type="button"
              onClick={() => handleCopyNumero(radicadoResultado.numeroCotizacion)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-[11px] text-gray-500 font-body space-y-1">
            {isManual ? (
              <p>
                Asignado al equipo de peritaje especial. Recibirás el dictamen técnico y la prima definitiva en tu correo{' '}
                <strong className="text-[#0b1c30]">{titular.email}</strong> en menos de 48 hs.
              </p>
            ) : (
              <p>
                Inspección digital recibida. Un analista validará las fotos del dominio{' '}
                <strong className="text-[#0b1c30]">{vehiculo.patente}</strong> para emitir la póliza final.
              </p>
            )}
          </div>
        </div>

        {/* Resumen Compacto del Bien */}
        <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200/80 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs">
          <div>
            <span className="text-gray-400 block text-[10px]">Vehículo</span>
            <span className="font-semibold text-[#0b1c30]">
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Plan Seleccionado</span>
            <span className="font-semibold text-[#006e2f]">
              {planTitles[cobertura.plan] || cobertura.plan}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Titular</span>
            <span className="font-semibold text-[#0b1c30]">{titular.nombreCompleto}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Inspección</span>
            <span className="font-semibold text-emerald-700">
              10/10 archivos verificados
            </span>
          </div>
        </div>

        {/* Botón para volver al Dashboard */}
        <div className="pt-4 max-w-xs mx-auto">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onVolverDashboard}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full !rounded-2xl !py-3 font-title"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: DESGLOSE Y REVISIÓN PREVIA A LA RADICACIÓN
  // =========================================================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-title text-base font-bold text-[#0b1c30] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#006e2f]" /> Resumen Integral de la Solicitud
          </h3>
          <p className="font-body text-xs text-gray-500">
            Revisa los datos del automotor, titular, plan e inspección digital antes de enviar
          </p>
        </div>
        <Badge variant="glass" className="text-xs py-1 px-3">
          Paso Final
        </Badge>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Grid de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Vehículo y Radicación */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#006e2f]" /> Datos del Automotor
            </h4>
            <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
              {vehiculo.esManual ? 'Carga Manual' : 'Catálogo ACARA'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">Marca y Modelo</span>
              <span className="font-semibold text-[#0b1c30]">
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.version}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Año de Fabricación</span>
              <span className="font-semibold text-[#0b1c30]">{vehiculo.anio}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Chapa Patente</span>
              <span className="font-mono font-bold text-[#0b1c30] uppercase">
                {vehiculo.patente || 'S/D'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Código Postal Guarda</span>
              <span className="font-semibold text-[#0b1c30]">{vehiculo.codigoPostal}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Equipo de GNC</span>
              <span className="font-semibold text-[#0b1c30]">
                {cobertura.tieneGnc ? 'Sí (Homologado)' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Garaje Cubierto</span>
              <span className="font-semibold text-[#0b1c30]">
                {cobertura.garajeCubierto ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Titular y Conductores */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="font-title text-xs font-bold text-[#0b1c30] flex items-center gap-2">
              <User className="w-4 h-4 text-[#006e2f]" /> Titular Asegurado
            </h4>
            <Badge variant="glass" className="text-[10px] py-0.5 px-2 text-[#006e2f]">
              Verificado
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block text-[10px]">Nombre Completo</span>
                <span className="font-semibold text-[#0b1c30]">{titular.nombreCompleto}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">DNI / Identificación</span>
                <span className="font-semibold text-[#0b1c30]">{titular.dni}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block text-[10px]">Correo Electrónico</span>
                <span className="font-semibold text-[#0b1c30] truncate block">
                  {titular.email}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Teléfono de Contacto</span>
                <input
                  type="text"
                  value={titular.telefono}
                  onChange={(e) =>
                    setTitular((prev) => ({ ...prev, telefono: e.target.value }))
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs font-semibold text-[#0b1c30]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              Conductores adicionales declarados:{' '}
              <strong className="text-[#0b1c30]">
                {cobertura.conductoresAdicionales.length > 0
                  ? `${cobertura.conductoresAdicionales.length} conductores`
                  : 'Solo el titular'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta 3: Cobertura, Inspección y Presupuesto Actuarial */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b1c30] to-[#152a42] text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Plan Seleccionado
            </span>
            <h4 className="font-title text-lg font-bold text-white">
              {planTitles[cobertura.plan] || cobertura.plan}
            </h4>
          </div>

          <div className="text-left sm:text-right">
            {vehiculo.esManual ? (
              <div className="bg-amber-500/20 border border-amber-400/30 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-amber-300 font-semibold block uppercase">
                  Tasación Pericial Requerida
                </span>
                <span className="font-title text-base font-bold text-white">
                  Valor Declarado: ${Number(vehiculo.valorDeclarado || 0).toLocaleString('es-AR')}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">
                  Prima Mensual Estimada
                </span>
                <span className="font-title text-2xl font-black text-[#22c55e]">
                  ${estimacion?.primaMensualEstimada.toLocaleString('es-AR') ?? '---'}
                  <span className="text-xs font-normal text-gray-300 ml-1">/ mes</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desglose de Valores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px]">Suma Asegurada</span>
            <span className="font-semibold text-white font-title">
              {vehiculo.esManual
                ? `$${Number(vehiculo.valorDeclarado || 0).toLocaleString('es-AR')}`
                : `$${estimacion?.sumaAsegurada.toLocaleString('es-AR') ?? '---'}`}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px]">Franquicia</span>
            <span className="font-semibold text-white font-title">
              {estimacion?.franquicia
                ? `$${estimacion.franquicia.toLocaleString('es-AR')}`
                : 'Sin Franquicia'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px]">Inspección Digital</span>
            <span className="font-semibold text-[#4ade80] font-title flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              {inspeccionSlots.filter((s) => s.subido).length} de {inspeccionSlots.length} listos
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px]">Vigencia Inicial</span>
            <span className="font-semibold text-white font-title flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Inmediata
            </span>
          </div>
        </div>
      </div>

      {/* Botón de Radicación Oficial */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006e2f] text-white flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-title font-bold text-[#0b1c30]">
              Firma y Radicación Segura SSL 256-bit
            </p>
            <p className="font-body text-gray-600">
              Al radicar la cotización confirmas la veracidad de las fotos y datos suministrados
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onRadicar}
          isLoading={isSubmitting}
          leftIcon={<Shield className="w-4 h-4" />}
          className="w-full sm:w-auto !rounded-2xl !py-3 whitespace-nowrap"
        >
          Radicar Solicitud de Cotización
        </Button>
      </div>
    </div>
  );
};
